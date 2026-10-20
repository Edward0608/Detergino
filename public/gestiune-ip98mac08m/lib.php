<?php
declare(strict_types=1);

/* Detergino gestiune: bibliotecă comună (sesiune, CSRF, stocare JSON, imagini). */

session_name('detergino_gestiune');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/gestiune-ip98mac08m/',
    'httponly' => true,
    'samesite' => 'Strict',
    'secure' => !empty($_SERVER['HTTPS']),
]);
session_start();

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

const DATA_DIR = __DIR__ . '/data';
const PRODUCTS_FILE = DATA_DIR . '/produse.json';
const AUTH_FILE = DATA_DIR . '/auth.php'; // PHP, ca să nu poată fi citit ca text chiar dacă .htaccess nu e respectat
const ATTEMPTS_FILE = DATA_DIR . '/incercari.json';

function h(?string $s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/* ---------- autentificare ---------- */

function credentials(): array
{
    $cfg = require __DIR__ . '/config.php';
    if (is_file(AUTH_FILE)) {
        $o = include AUTH_FILE;
        if (is_array($o) && !empty($o['hash'])) {
            $cfg['hash'] = $o['hash'];
        }
        if (is_array($o) && !empty($o['pin_hash'])) {
            $cfg['pin_hash'] = $o['pin_hash'];
        }
    }
    return $cfg;
}

function is_logged(): bool
{
    return !empty($_SESSION['ok']) && ($_SESSION['ua'] ?? '') === hash('sha256', $_SERVER['HTTP_USER_AGENT'] ?? '');
}

function require_login(): void
{
    if (!is_logged()) {
        header('Location: /gestiune-ip98mac08m/');
        exit;
    }
}

function client_ip(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

/** Blocare simplă: 5 încercări greșite în 15 minute de pe aceeași adresă. */
function login_locked(): bool
{
    $all = is_file(ATTEMPTS_FILE) ? (json_decode((string) file_get_contents(ATTEMPTS_FILE), true) ?: []) : [];
    $now = time();
    $recent = array_filter($all[client_ip()] ?? [], fn ($t) => $now - $t < 900);
    return count($recent) >= 5;
}

function login_fail(): void
{
    $all = is_file(ATTEMPTS_FILE) ? (json_decode((string) file_get_contents(ATTEMPTS_FILE), true) ?: []) : [];
    $now = time();
    foreach ($all as $ip => $list) {
        $all[$ip] = array_values(array_filter($list, fn ($t) => $now - $t < 900));
        if (!$all[$ip]) {
            unset($all[$ip]);
        }
    }
    $all[client_ip()][] = $now;
    file_put_contents(ATTEMPTS_FILE, json_encode($all), LOCK_EX);
}

/** Pasul 1 (utilizator + parolă) reușit, urmează codul. */
function pre_ok(): void
{
    session_regenerate_id(true);
    $_SESSION['pre'] = time();
    $_SESSION['pin_fails'] = 0;
}

function is_pre(): bool
{
    return !empty($_SESSION['pre']) && time() - (int) $_SESSION['pre'] < 300;
}

function login_ok(): void
{
    unset($_SESSION['pre'], $_SESSION['pin_fails']);
    session_regenerate_id(true);
    $_SESSION['ok'] = true;
    $_SESSION['ua'] = hash('sha256', $_SERVER['HTTP_USER_AGENT'] ?? '');
    $_SESSION['csrf'] = bin2hex(random_bytes(16));
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(16));
    }
    return $_SESSION['csrf'];
}

function csrf_check(): void
{
    $t = $_POST['csrf'] ?? '';
    if (!is_string($t) || !hash_equals(csrf_token(), $t)) {
        http_response_code(400);
        exit('Sesiunea a expirat. Reîncarcă pagina și încearcă din nou.');
    }
}

/* ---------- stocare produse ---------- */

function load_products(): array
{
    if (!is_file(PRODUCTS_FILE)) {
        return [];
    }
    $d = json_decode((string) file_get_contents(PRODUCTS_FILE), true);
    return is_array($d) ? array_values($d) : [];
}

function save_products(array $list): void
{
    $json = json_encode(array_values($list), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    $tmp = PRODUCTS_FILE . '.tmp';
    $fp = fopen(DATA_DIR . '/.lock', 'c');
    flock($fp, LOCK_EX);
    file_put_contents($tmp, $json);
    rename($tmp, PRODUCTS_FILE);
    flock($fp, LOCK_UN);
    fclose($fp);
}

function categories(): array
{
    $f = __DIR__ . '/categorii.json';
    $d = is_file($f) ? json_decode((string) file_get_contents($f), true) : null;
    return is_array($d) ? $d : ['groups' => [], 'categories' => [], 'brands' => []];
}

function slugify(string $s): string
{
    $s = mb_strtolower($s, 'UTF-8');
    $map = ['ă' => 'a', 'â' => 'a', 'î' => 'i', 'ș' => 's', 'ş' => 's', 'ț' => 't', 'ţ' => 't'];
    $s = strtr($s, $map);
    $t = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $s);
    $s = $t !== false ? $t : $s;
    $s = preg_replace('/[^a-z0-9]+/', '-', $s) ?? '';
    return trim($s, '-') ?: 'produs';
}

/* ---------- imagini ---------- */

const UPLOAD_DIR = __DIR__ . '/../uploads/produse';
const UPLOAD_URL = '/uploads/produse';
const MAX_SIDE = 1200;

/** Validează, redimensionează la maximum 1200 px și salvează WebP comprimat (păstrează transparența). */
function process_image(string $tmp, string $slug, int $n): array
{
    $info = @getimagesize($tmp);
    if (!$info || !in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP], true)) {
        throw new RuntimeException('Format neacceptat (folosește JPG, PNG sau WebP).');
    }
    if ($info[0] * $info[1] > 40_000_000) {
        throw new RuntimeException('Imaginea este prea mare.');
    }
    $img = @imagecreatefromstring((string) file_get_contents($tmp));
    if (!$img) {
        throw new RuntimeException('Imaginea nu poate fi citită.');
    }
    [$w, $h] = [imagesx($img), imagesy($img)];
    $s = min(1.0, MAX_SIDE / max($w, $h));
    if ($s < 1.0) {
        $nw = (int) round($w * $s);
        $nh = (int) round($h * $s);
        $dst = imagecreatetruecolor($nw, $nh);
        imagealphablending($dst, false);
        imagesavealpha($dst, true);
        imagefill($dst, 0, 0, imagecolorallocatealpha($dst, 0, 0, 0, 127));
        imagecopyresampled($dst, $img, 0, 0, 0, 0, $nw, $nh, $w, $h);
        imagedestroy($img);
        $img = $dst;
        [$w, $h] = [$nw, $nh];
    }
    imagepalettetotruecolor($img);
    imagealphablending($img, false);
    imagesavealpha($img, true);
    if (!is_dir(UPLOAD_DIR) && !mkdir(UPLOAD_DIR, 0755, true) && !is_dir(UPLOAD_DIR)) {
        throw new RuntimeException('Nu pot crea folderul de poze.');
    }
    $name = $slug . '-' . $n . '-' . bin2hex(random_bytes(3)) . '.webp';
    if (!imagewebp($img, UPLOAD_DIR . '/' . $name, 80)) {
        throw new RuntimeException('Nu pot salva imaginea.');
    }
    imagedestroy($img);
    return ['src' => UPLOAD_URL . '/' . $name, 'px' => max($w, $h)];
}

function delete_image(string $src): void
{
    if (strpos($src, UPLOAD_URL . '/') === 0) {
        $f = UPLOAD_DIR . '/' . basename($src);
        if (is_file($f)) {
            @unlink($f);
        }
    }
}

/* ---------- aspect ---------- */

function page_head(string $title): void
{
    echo '<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">';
    echo '<meta name="robots" content="noindex,nofollow"><title>' . h($title) . ' | Detergino</title>';
    echo '<link rel="stylesheet" href="/gestiune-ip98mac08m/admin.css"></head><body>';
}

function page_nav(): void
{
    echo '<header class="bar"><a class="brand" href="/gestiune-ip98mac08m/">DETERGINO <span>gestiune</span></a><nav>';
    echo '<a href="/gestiune-ip98mac08m/">Produse</a><a href="/gestiune-ip98mac08m/produs.php">Adaugă produs</a><a href="/" target="_blank" rel="noopener">Vezi site-ul</a>';
    echo '<a href="/gestiune-ip98mac08m/parola.php">Parola</a>';
    echo '<form method="post" action="/gestiune-ip98mac08m/logout.php"><input type="hidden" name="csrf" value="' . h(csrf_token()) . '"><button class="link">Ieșire</button></form>';
    echo '</nav></header><main>';
}

function page_foot(): void
{
    echo '</main></body></html>';
}
