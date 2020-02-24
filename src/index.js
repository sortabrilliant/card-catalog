/* global _wpUtilSettings */
/**
 * Internal dependencies
 */
import metadata from './block.json';
import { default as edit } from './edit';
import { default as icon } from './icon';
import { default as save } from './save';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { ExternalLink } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

registerBlockType( 'sortabrilliant/card-catalog', {
	title: __( 'Card Catalog', 'card-catalog' ),
	description: (
		<Fragment>
			<p>{ __( 'Card Catalog Description', 'card-catalog' ) }</p>
			<ExternalLink href={ _wpUtilSettings.ajax.url.replace('admin-ajax.php', 'plugin-install.php?s=sortabrilliant&tab=search&type=author') }>
				{ __( 'More from sortabrilliant', 'card-catalog' ) }
			</ExternalLink>
		</Fragment>
	),
	icon,
	category: metadata.category,
	keywords: [
		__( 'sortabrilliant', 'card-catalog' ),
		__( 'file', 'card-catalog' ),
	],

	attributes: metadata.attributes,

	styles: [
		{
			name: 'default',
			label: __( 'Default', 'card-catalog' ),
		},
		{
			name: 'grid-view',
			label: __( 'Grid View', 'card-catalog' ),
			isDefault: true,
		},
		{
			name: 'list-view',
			label: __( 'List View', 'card-catalog' ),
		},
	],

	supports: {
		html: false,
	},

	edit,
	save,
} );
