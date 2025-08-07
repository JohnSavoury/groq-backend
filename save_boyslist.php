<?php
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['boys'])) {
    file_put_contents("boys.txt", $data['boys']);
}
echo "OK";
?>