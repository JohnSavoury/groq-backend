<?php
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['girls'])) {
    file_put_contents("girls.txt", $data['girls']);
}

echo "OK";
?>