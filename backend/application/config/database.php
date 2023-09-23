<?php
defined('BASEPATH') or exit('No direct script access allowed');


//$active_group = 'default';
//$query_builder = TRUE;
//
//$db['default'] = array(
//	'dsn'	=> '',
//	'hostname' => 'localhost',
//	'username' => 'root',
//	'password' => '',
//	'database' => 'hotel_db',
//	'dbdriver' => 'mysqli',
//	'dbprefix' => '',
//	'pconnect' => FALSE,
//	'db_debug' => (ENVIRONMENT !== 'production'),
//	'cache_on' => FALSE,
//	'cachedir' => '',
//	'char_set' => 'utf8',
//	'dbcollat' => 'utf8_general_ci',
//	'swap_pre' => '',
//	'encrypt' => FALSE,
//	'compress' => FALSE,
//	'stricton' => FALSE,
//	'failover' => array(),
//	'save_queries' => TRUE
//);


$active_group = 'default';
$query_builder = TRUE;
$db['default']['hostname'] = '68.178.147.210';
$db['default']['username'] = 'smr_kalamb_beach';
$db['default']['password'] = 'smr_kalamb_beach@6999';
$db['default']['database'] = 'smr_kalamb_beach';
$db['default']['dsn'] = '';
$db['default']['dbdriver'] = 'mysqli';
$db['default']['dbprefix'] = '';
$db['default']['pconnect'] = FALSE;
$db['default']['db_debug'] = (ENVIRONMENT !== 'production');
$db['default']['cache_on'] = FALSE;
$db['default']['cachedir'] = '';
$db['default']['char_set'] = 'utf8';
$db['default']['dbcollat'] = 'utf8_general_ci';
$db['default']['swap_pre'] = '';
$db['default']['encrypt'] = FALSE;
$db['default']['compress'] = FALSE;
$db['default']['stricton'] = FALSE;
$db['default']['failover'] = array();
$db['default']['save_queries'] = TRUE;
