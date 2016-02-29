<?php
    if(isset($_POST)){
        $username = 'recr%20erutan';

        $url = 'http://services.runescape.com/m=hiscore_oldschool/index_lite.ws?player=' . $username;

        echo json_encode(file_get_contents($url));
    }
?>