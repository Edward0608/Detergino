<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';
require_login();

$msg = '';
$err = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $cfg = credentials();
    $old = (string) ($_POST['old'] ?? '');
    $new = (string) ($_POST['new'] ?? '');
    $new2 = (string) ($_POST['new2'] ?? '');
    $pin = preg_replace('/\D/', '', (string) ($_POST['pin'] ?? '')) ?? '';
    if (!password_verify($old, $cfg['hash'])) {
        $err = 'Parola actuală nu este corectă.';
    } elseif ($new !== '' && strlen($new) < 10) {
        $err = 'Parola nouă trebuie să aibă cel puțin 10 caractere.';
    } elseif ($new !== $new2) {
        $err = 'Cele două parole noi nu coincid.';
    } elseif ($pin !== '' && strlen($pin) !== 4) {
        $err = 'Codul de securitate nou trebuie să aibă exact 4 cifre.';
    } elseif ($new === '' && $pin === '') {
        $err = 'Completează o parolă nouă sau un cod nou.';
    } else {
        $data = ['hash' => $new !== '' ? password_hash($new, PASSWORD_DEFAULT) : $cfg['hash'], 'pin_hash' => $pin !== '' ? password_hash($pin, PASSWORD_DEFAULT) : $cfg['pin_hash']];
        file_put_contents(AUTH_FILE, '<?php return ' . var_export($data, true) . ';', LOCK_EX);
        $msg = 'Datele de acces au fost salvate.';
    }
}
page_head('Parola');
page_nav();
?>
<div class="head"><h1>Parolă și cod de securitate</h1></div>
<form method="post" class="card narrow">
  <input type="hidden" name="csrf" value="<?= h(csrf_token()) ?>">
  <?php if ($msg) echo '<p class="ok">' . h($msg) . '</p>'; if ($err) echo '<p class="err">' . h($err) . '</p>'; ?>
  <label>Parola actuală<input type="password" name="old" required autocomplete="current-password"></label>
  <label>Parola nouă (minimum 10 caractere, lasă gol ca să o păstrezi)<input type="password" name="new" minlength="10" autocomplete="new-password"></label>
  <label>Repetă parola nouă<input type="password" name="new2" minlength="10" autocomplete="new-password"></label>
  <label>Cod de securitate nou (exact 4 cifre, lasă gol ca să îl păstrezi)<input name="pin" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="off"></label>
  <button class="btn" type="submit">Salvează parola</button>
</form>
<?php page_foot();
