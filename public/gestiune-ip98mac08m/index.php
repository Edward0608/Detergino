<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

$err = '';
$step = 1;
if (!is_logged()) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['pin'])) {
        /* pasul 2: codul de securitate (se afișează ca 10 cifre, dar cel real are 4) */
        $step = 2;
        if (!is_pre()) {
            $step = 1;
            $err = 'Sesiunea a expirat. Autentifică-te din nou.';
        } elseif (login_locked()) {
            $err = 'Prea multe încercări. Încearcă din nou peste 15 minute.';
        } else {
            $cfg = credentials();
            $pin = preg_replace('/\D/', '', (string) $_POST['pin']) ?? '';
            if ($pin !== '' && password_verify($pin, $cfg['pin_hash'])) {
                login_ok();
                header('Location: /gestiune-ip98mac08m/');
                exit;
            }
            login_fail();
            usleep(400000);
            $_SESSION['pin_fails'] = ($_SESSION['pin_fails'] ?? 0) + 1;
            if ($_SESSION['pin_fails'] >= 3) {
                unset($_SESSION['pre']);
                $step = 1;
                $err = 'Cod greșit. Autentifică-te din nou.';
            } else {
                $err = 'Cod greșit.';
            }
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (login_locked()) {
            $err = 'Prea multe încercări. Încearcă din nou peste 15 minute.';
        } else {
            $cfg = credentials();
            $u = (string) ($_POST['user'] ?? '');
            $p = (string) ($_POST['pass'] ?? '');
            if (hash_equals($cfg['user'], $u) && password_verify($p, $cfg['hash'])) {
                pre_ok();
                $step = 2;
            } else {
                login_fail();
                usleep(400000);
                $err = 'Utilizator sau parolă greșite.';
            }
        }
    } elseif (is_pre()) {
        $step = 2;
    }
}

if (!is_logged()) {
    page_head($step === 2 ? 'Cod de securitate' : 'Autentificare');
    ?>
    <main class="login">
      <?php if ($step === 2): ?>
      <form method="post" class="card" autocomplete="off">
        <h1>DETERGINO <span>gestiune</span></h1>
        <p class="muted">Pasul 2 din 2. Introdu codul de securitate.</p>
        <?php if ($err) echo '<p class="err">' . h($err) . '</p>'; ?>
        <label for="pin">Cod de securitate (10 cifre)</label>
        <div class="pin" id="pinbox">
          <input id="pin" name="pin" inputmode="numeric" pattern="[0-9]*" maxlength="10" autocomplete="one-time-code" autofocus required aria-describedby="pinhelp">
          <div class="cells" aria-hidden="true"><?php for ($i = 0; $i < 10; $i++) echo '<i></i>'; ?></div>
        </div>
        <p id="pinhelp" class="muted small">Tastează cele 10 cifre ale codului, apoi apasă „Intră”.</p>
        <button class="btn" type="submit">Intră</button>
      </form>
      <script>
        (function(){var i=document.getElementById('pin'),c=document.querySelectorAll('#pinbox .cells i');
        function r(){var v=i.value.replace(/\D/g,'');i.value=v;c.forEach(function(e,k){e.textContent=v[k]?'●':'';e.className=k===v.length?'on':''});}
        i.addEventListener('input',r);r();})();
      </script>
      <?php else: ?>
      <form method="post" class="card" autocomplete="on">
        <h1>DETERGINO <span>gestiune</span></h1>
        <p class="muted">Autentifică-te ca să adaugi sau să modifici produse.</p>
        <?php if ($err) echo '<p class="err">' . h($err) . '</p>'; ?>
        <label>Utilizator<input name="user" required autofocus autocomplete="username"></label>
        <label>Parolă<input name="pass" type="password" required autocomplete="current-password"></label>
        <button class="btn" type="submit">Continuă</button>
      </form>
      <?php endif; ?>
    </main>
    <?php
    echo '</body></html>';
    exit;
}

$list = load_products();
$cats = categories();
usort($list, fn ($a, $b) => strcmp((string) ($b['created'] ?? ''), (string) ($a['created'] ?? '')));
page_head('Produse');
page_nav();
if (!empty($_GET['ok'])) {
    echo '<p class="ok">' . h((string) $_GET['ok']) . '</p>';
}
?>
<div class="head">
  <h1>Produsele tale <span class="count"><?= count($list) ?></span></h1>
  <a class="btn" href="/gestiune-ip98mac08m/produs.php">+ Adaugă produs</a>
</div>
<p class="muted">Aici apar produsele adăugate din gestiune. Cele din catalogul inițial (136 de produse) se modifică în continuare prin cod. Produsele noi se văd pe site în câteva secunde, în catalog, căutare și lista de ofertă.</p>
<?php if (!$list): ?>
  <div class="card empty"><p>Încă nu ai adăugat niciun produs.</p><a class="btn" href="/gestiune-ip98mac08m/produs.php">Adaugă primul produs</a></div>
<?php else: ?>
  <div class="table">
    <?php foreach ($list as $p):
        $cat = $cats['categories'][$p['category']]['name'] ?? $p['category'];
        $img = $p['images'][0]['src'] ?? ''; ?>
      <div class="row">
        <div class="thumb"><?php if ($img) echo '<img src="' . h($img) . '" alt="">'; ?></div>
        <div class="info">
          <strong><?= h($p['name']) ?></strong>
          <span class="muted"><?= h($p['brand'] ?? '') ?><?= $p['size'] ? ' · ' . h($p['size']) : '' ?> · <?= h($cat) ?></span>
          <?php if (!empty($p['hidden'])) echo '<span class="tag">Ascuns</span>'; ?>
        </div>
        <div class="acts">
          <a class="btn ghost" href="/gestiune-ip98mac08m/produs.php?id=<?= h($p['slug']) ?>">Modifică</a>
          <a class="btn ghost" target="_blank" rel="noopener" href="/produs/?s=<?= h(rawurlencode($p['slug'])) ?>">Vezi</a>
          <form method="post" action="/gestiune-ip98mac08m/produs.php" onsubmit="return confirm('Ștergi definitiv produsul „<?= h(addslashes($p['name'])) ?>”?')">
            <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
            <input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= h($p['slug']) ?>">
            <button class="btn danger" type="submit">Șterge</button>
          </form>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
<?php endif;
page_foot();
