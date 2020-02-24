<?php
/**
 * Plugin Name: Card Catalog
 * Plugin URI: https://sortabrilliant.com/card-catalog/
 * Description: Rejoice digital hoarders. You now have way to easily display large numbers of files on your WordPress site.
 * Author: sorta brilliant
 * Author URI: https://sortabrilliant.com
 * Version: 1.0.0
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CardCatalog
 */

defined( 'ABSPATH' ) || exit;

define( 'CARD_CATALOG_VERSION', '1.0.0' );
define( 'CARD_CATALOG_PLUGIN_DIR', dirname( __FILE__ ) );
define( 'CARD_CATALOG_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 */
function card_catalog_register_block() {
	$default_asset_file = array(
		'dependencies' => array(),
		'version'      => CARD_CATALOG_VERSION,
	);

	// Editor Script.
	$asset_filepath = CARD_CATALOG_PLUGIN_DIR . '/build/index.asset.php';
	$asset_file     = file_exists( $asset_filepath ) ? include $asset_filepath : $default_asset_file;

	wp_register_script(
		'card-catalog-script',
		CARD_CATALOG_PLUGIN_URL . 'build/index.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		true // Enqueue script in the footer.
	);

	// Editor Styles.
	$asset_filepath = CARD_CATALOG_PLUGIN_DIR . '/build/card-catalog-editor.asset.php';
	$asset_file     = file_exists( $asset_filepath ) ? include $asset_filepath : $default_asset_file;

	wp_register_style(
		'card-catalog-editor-style',
		CARD_CATALOG_PLUGIN_URL . 'build/card-catalog-editor.css',
		array(),
		$asset_file['version']
	);

	// Frontend Styles.
	$asset_filepath = CARD_CATALOG_PLUGIN_DIR . '/build/card-catalog-style.asset.php';
	$asset_file     = file_exists( $asset_filepath ) ? include $asset_filepath : $default_asset_file;

	wp_register_style(
		'card-catalog-frontend-style',
		CARD_CATALOG_PLUGIN_URL . 'build/card-catalog-style.css',
		array(),
		$asset_file['version']
	);

	register_block_type(
		'sortabrilliant/card-catalog',
		array(
			'editor_script' => 'card-catalog-script',
			'editor_style'  => 'card-catalog-editor-style',
			'style'         => 'card-catalog-frontend-style',
		)
	);

	if ( ! is_admin() ) {
		// Frontend Script.
		$asset_filepath = CARD_CATALOG_PLUGIN_DIR . '/build/card-catalog-frontend.asset.php';
		$asset_file     = file_exists( $asset_filepath ) ? include $asset_filepath : $default_asset_file;

		wp_enqueue_script(
			'card-catalog-frontend',
			CARD_CATALOG_PLUGIN_URL . 'build/card-catalog-frontend.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true // Enqueue script in the footer.
		);
	}
}

add_action( 'init', 'card_catalog_register_block' );
