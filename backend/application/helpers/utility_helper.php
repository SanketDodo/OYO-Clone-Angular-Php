<?php

function asset_url()
{
    return base_url() . 'application/assets/';
}

function controller_url()
{
    return base_url();
}

function reset_url()
{
    return base_url() . '/reset';
}

function smart_view()
{
    return base_url() . 'application/controllers/smart_view_controller/';
}

function session_timeout()
{
    echo '<script type="text/javascript">
    //Script for timeout session.
var IDLE_TIMEOUT = 300; //seconds
var _idleSecondsCounter = 0;
document.onclick = function () {
    _idleSecondsCounter = 0;
};
document.onmousemove = function () {
    _idleSecondsCounter = 0;
};
document.onkeypress = function () {
    _idleSecondsCounter = 0;
};
window.setInterval(CheckIdleTime, 1000);

function CheckIdleTime() {
    _idleSecondsCounter++;
    var oPanel = document.getElementById("SecondsUntilExpire");
    if (oPanel)
        oPanel.innerHTML = (IDLE_TIMEOUT - _idleSecondsCounter) + "";
    if (_idleSecondsCounter >= IDLE_TIMEOUT) {
        window.location.href = "' . base_url() . 'login/logout";
    }
}
</script>';

}

function curl_post_async($url, $params = array())
{

    $post_params = array();

    foreach ($params as $key => &$val) {
        if (is_array($val)) $val = implode(',', $val);
        $post_params[] = $key . '=' . urlencode($val);
    }

    $post_string = implode('&', $post_params);

    $parts = parse_url($url);

    $fp = fsockopen($parts['host'],
        isset($parts['port']) ? $parts['port'] : 80, $errno, $errstr, 30);

    $out = "POST " . $parts['path'] . " HTTP/1.1\r\n";
    $out .= "Host: " . $parts['host'] . "\r\n";
    $out .= "Content-Type: application/x-www-form-urlencoded\r\n";
    $out .= "Content-Length: " . strlen($post_string) . "\r\n";
    $out .= "Connection: Close\r\n\r\n";

    if (isset($post_string)) $out .= $post_string;

    fwrite($fp, $out);
    fclose($fp);
}

?>
