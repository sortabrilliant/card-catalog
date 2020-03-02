/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { InnerBlocks } from '@wordpress/block-editor';

class CardCatalogSave extends Component {
	render( { className } ) {
		return (
			<div className={ className }>
				<InnerBlocks.Content />
			</div>
		);
	}
}

export default CardCatalogSave;