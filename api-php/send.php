<?php
function sha256($str) {
    return hash('sha256', $str);
}

function mineBlock($index, $timestamp, $amount, $prevHash, $difficulty = 2) {
    $nonce = 0;
    do {
        $data = $index . $timestamp . $amount . $prevHash . $nonce;
        $hash = sha256($data);
        $nonce++;
    } while(substr($hash, 0, $difficulty) !== str_repeat('0', $difficulty));
    return $hash;
}

$index = 0;
$timestamp = date('c');
$amount = rand(50, 500);
$prevHash = "0";

$hash = mineBlock($index, $timestamp, $amount, $prevHash);

echo "NXT ⥉ PHP send.php: Block mined\n";
echo "Amount: $amount\n";
echo "Hash: $hash\n";
?>
