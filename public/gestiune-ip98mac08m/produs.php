<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';
require_login();

$cats = categories();
$list = load_products();

function find_index(array $list, string $slug): ?int
{
    foreach ($list as $i => $p) {
        if (($p['slug'] ?? '') === $slug) {
            return $i;
        }
    }
    return null;
}

function num($v): ?int
{
    $v = trim((string) $v);
    return $v !== '' && ctype_digit($v) ? (int) $v : null;
}

/* ---------- ștergere ---------- */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'delete') {
    csrf_check();
    $i = find_index($list, (string) ($_POST['id'] ?? ''));
    if ($i !== null) {
        foreach ($list[$i]['images'] ?? [] as $im) {
            delete_image($im['src']);
        }
        array_splice($list, $i, 1);
        save_products($list);
    }
    header('Location: /gestiune-ip98mac08m/?ok=' . rawurlencode('Produsul a fost șters.'));
    exit;
}

$id = (string) ($_GET['id'] ?? $_POST['id'] ?? '');
$idx = $id !== '' ? find_index($list, $id) : null;
$p = $idx !== null ? $list[$idx] : [
    'name' => '', 'brand' => '', 'type' => '', 'category' => '', 'variant' => '', 'size' => '', 'washes' => null,
    'barcode' => '', 'note' => '', 'packaging' => [], 'images' => [], 'hidden' => false,
];
if ($id !== '' && $idx === null) {
    http_response_code(404);
    exit('Produsul nu există.');
}

$errors = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $name = trim((string) ($_POST['name'] ?? ''));
    $category = (string) ($_POST['category'] ?? '');
    $size = trim((string) ($_POST['size'] ?? ''));
    $barcode = preg_replace('/\s+/', '', (string) ($_POST['barcode'] ?? '')) ?? '';
    if ($name === '' || mb_strlen($name) > 140) {
        $errors[] = 'Numele este obligatoriu (maximum 140 de caractere).';
    }
    if (!isset($cats['categories'][$category])) {
        $errors[] = 'Alege o categorie.';
    }
    if ($barcode !== '' && !preg_match('/^\d{8,14}$/', $barcode)) {
        $errors[] = 'Codul de bare trebuie să conțină doar cifre (8–14).';
    }

    $new = [
        'slug' => $p['slug'] ?? '',
        'name' => $name,
        'type' => trim((string) ($_POST['type'] ?? '')) ?: $name,
        'brand' => trim((string) ($_POST['brand'] ?? '')) ?: null,
        'variant' => trim((string) ($_POST['variant'] ?? '')) ?: null,
        'category' => $category,
        'size' => $size !== '' ? $size : null,
        'washes' => num($_POST['washes'] ?? ''),
        'barcode' => $barcode !== '' ? $barcode : null,
        'note' => trim((string) ($_POST['note'] ?? '')) ?: null,
        'packaging' => [
            'bucBax' => num($_POST['bucBax'] ?? ''),
            'baxRand' => num($_POST['baxRand'] ?? ''),
            'randPal' => num($_POST['randPal'] ?? ''),
            'baxPal' => num($_POST['baxPal'] ?? ''),
            'bucPalet' => num($_POST['bucPalet'] ?? ''),
        ],
        'images' => $p['images'] ?? [],
        'hidden' => !empty($_POST['hidden']),
        'created' => $p['created'] ?? date('c'),
        'extra' => true,
    ];

    if (!$errors) {
        if ($idx === null) {
            $base = slugify($name . ' ' . $size);
            $slug = $base;
            $taken = array_column($list, 'slug');
            for ($n = 2; in_array($slug, $taken, true); $n++) {
                $slug = $base . '-' . $n;
            }
            $new['slug'] = $slug;
        }
        $new['family'] = $new['slug'];
        $new['source'] = ['pdf' => 'admin', 'page' => 0];

        // poze existente: ștergere și „fă principală”
        $keep = [];
        $remove = (array) ($_POST['remove'] ?? []);
        foreach ($new['images'] as $im) {
            if (in_array($im['src'], $remove, true)) {
                delete_image($im['src']);
            } else {
                $keep[] = $im;
            }
        }
        $main = (string) ($_POST['main'] ?? '');
        if ($main !== '') {
            usort($keep, fn ($a, $b) => ($b['src'] === $main) <=> ($a['src'] === $main));
        }
        // poze noi
        $files = $_FILES['poze'] ?? null;
        if ($files && is_array($files['name'])) {
            foreach ($files['name'] as $k => $orig) {
                if ($files['error'][$k] === UPLOAD_ERR_NO_FILE) {
                    continue;
                }
                if ($files['error'][$k] !== UPLOAD_ERR_OK) {
                    $errors[] = 'Poza „' . $orig . '” nu a putut fi încărcată (cod ' . $files['error'][$k] . ').';
                    continue;
                }
                try {
                    $keep[] = process_image($files['tmp_name'][$k], $new['slug'], count($keep) + 1);
                } catch (Throwable $e) {
                    $errors[] = 'Poza „' . $orig . '”: ' . $e->getMessage();
                }
            }
        }
        $new['images'] = array_values($keep);
        if (!$new['images'] && !$errors) {
            $errors[] = 'Adaugă cel puțin o poză.';
        }
    }

    if (!$errors) {
        if ($idx === null) {
            $list[] = $new;
        } else {
            $list[$idx] = $new;
        }
        save_products($list);
        header('Location: /gestiune-ip98mac08m/?ok=' . rawurlencode($idx === null ? 'Produsul a fost adăugat.' : 'Modificările au fost salvate.'));
        exit;
    }
    $p = array_merge($p, $new);
}

$pk = $p['packaging'] ?? [];
page_head($idx === null ? 'Produs nou' : 'Modifică produsul');
page_nav();
?>
<div class="head"><h1><?= $idx === null ? 'Produs nou' : 'Modifică produsul' ?></h1></div>
<?php if ($errors): ?><div class="err"><?php foreach ($errors as $e) echo '<p>' . h($e) . '</p>'; ?></div><?php endif; ?>
<form method="post" enctype="multipart/form-data" class="card form">
  <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
  <input type="hidden" name="id" value="<?= h((string) ($p['slug'] ?? '')) ?>">

  <label class="wide">Nume produs *
    <input name="name" required maxlength="140" value="<?= h($p['name']) ?>" placeholder="ex: Detergent lichid de rufe Free Gold">
  </label>
  <label>Marcă
    <input name="brand" list="marci" value="<?= h((string) $p['brand']) ?>" placeholder="ex: Free">
    <datalist id="marci"><?php foreach ($cats['brands'] ?? [] as $b) echo '<option value="' . h($b) . '">'; ?></datalist>
  </label>
  <label>Categorie *
    <select name="category" required>
      <option value="">Alege…</option>
      <?php foreach ($cats['groups'] as $gslug => $gname): ?>
        <optgroup label="<?= h($gname) ?>">
          <?php foreach ($cats['categories'] as $cslug => $c) if ($c['group'] === $gslug): ?>
            <option value="<?= h($cslug) ?>" <?= $p['category'] === $cslug ? 'selected' : '' ?>><?= h($c['name']) ?></option>
          <?php endif; ?>
        </optgroup>
      <?php endforeach; ?>
    </select>
  </label>
  <label>Ambalaj / mărime
    <input name="size" value="<?= h((string) $p['size']) ?>" placeholder="ex: 4 L, 500 g, 120 buc">
  </label>
  <label>Variantă / aromă
    <input name="variant" value="<?= h((string) $p['variant']) ?>" placeholder="ex: Lavandă">
  </label>
  <label>Tip produs
    <input name="type" value="<?= h((string) ($p['type'] ?? '')) ?>" placeholder="ex: Detergent lichid de rufe (implicit: numele)">
  </label>
  <label>Număr de spălări (opțional)
    <input name="washes" inputmode="numeric" value="<?= h((string) ($p['washes'] ?? '')) ?>">
  </label>
  <label>Cod de bare (EAN)
    <input name="barcode" inputmode="numeric" value="<?= h((string) $p['barcode']) ?>" placeholder="8–14 cifre">
  </label>
  <label class="wide">Notă (opțional)
    <input name="note" maxlength="120" value="<?= h((string) $p['note']) ?>">
  </label>

  <fieldset class="wide">
    <legend>Ambalare</legend>
    <div class="grid5">
      <label>Buc / bax<input name="bucBax" inputmode="numeric" value="<?= h((string) ($pk['bucBax'] ?? '')) ?>"></label>
      <label>Baxuri / rând<input name="baxRand" inputmode="numeric" value="<?= h((string) ($pk['baxRand'] ?? '')) ?>"></label>
      <label>Rânduri / palet<input name="randPal" inputmode="numeric" value="<?= h((string) ($pk['randPal'] ?? '')) ?>"></label>
      <label>Baxuri / palet<input name="baxPal" inputmode="numeric" value="<?= h((string) ($pk['baxPal'] ?? '')) ?>"></label>
      <label>Buc / palet<input name="bucPalet" inputmode="numeric" value="<?= h((string) ($pk['bucPalet'] ?? '')) ?>"></label>
    </div>
  </fieldset>

  <fieldset class="wide">
    <legend>Poze</legend>
    <?php if (!empty($p['images'])): ?>
      <div class="imgs">
        <?php foreach ($p['images'] as $k => $im): ?>
          <div class="img">
            <img src="<?= h($im['src']) ?>" alt="">
            <label class="chk"><input type="radio" name="main" value="<?= h($im['src']) ?>" <?= $k === 0 ? 'checked' : '' ?>> principală</label>
            <label class="chk del"><input type="checkbox" name="remove[]" value="<?= h($im['src']) ?>"> șterge</label>
          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
    <input type="file" name="poze[]" accept="image/jpeg,image/png,image/webp" multiple>
    <p class="muted">JPG, PNG sau WebP. Pozele se redimensionează automat la maximum 1200 px și se comprimă (WebP). Prima poză este cea principală; un PNG cu fundal transparent se afișează curat pe panoul alb.</p>
  </fieldset>

  <label class="chk wide"><input type="checkbox" name="hidden" value="1" <?= !empty($p['hidden']) ? 'checked' : '' ?>> Ascunde produsul de pe site (rămâne salvat aici)</label>

  <div class="wide actions">
    <button class="btn" type="submit">Salvează</button>
    <a class="btn ghost" href="/gestiune-ip98mac08m/">Anulează</a>
  </div>
</form>
<?php page_foot();
