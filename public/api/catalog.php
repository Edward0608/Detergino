<?php
declare(strict_types=1);
/* API public, doar citire: produsele adăugate din gestiune (fără cele ascunse). */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=30');
header('X-Content-Type-Options: nosniff');

$file = dirname(__DIR__) . '/gestiune-ip98mac08m/data/produse.json';
$list = is_file($file) ? json_decode((string) file_get_contents($file), true) : [];
$out = [];
foreach (is_array($list) ? $list : [] as $p) {
    if (!empty($p['hidden'])) {
        continue;
    }
    unset($p['hidden'], $p['created']);
    $out[] = $p;
}
echo json_encode($out, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
