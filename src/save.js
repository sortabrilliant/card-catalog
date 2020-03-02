/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { InnerBlocks } from '@wordpress/block-editor';

class CardCatalogSave extends Component {
	render( props ) {
		const { className } = props;

		return props.innerBlocks && (
			<div className={ className }>
				<InnerBlocks.Content />
			</div>
		);
	}
}

export default CardCatalogSave;