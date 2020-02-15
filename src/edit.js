/**
 * WordPress dependencies
 */
import { withNotices } from '@wordpress/components';
import { Component } from '@wordpress/element';
import { MediaPlaceholder, BlockIcon, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { file as icon } from '@wordpress/icons';

class CardCatalogEdit extends Component {
	constructor() {
		super( ...arguments );

		this.onSelectFiles = this.onSelectFiles.bind( this );
		this.onUploadError = this.onUploadError.bind( this );
	}

	onSelectFiles( files ) {
		const {
			clientId,
			fileIds,
			insertBlocks,
		} = this.props;

		const newBlocks = files
			.filter( file => file && file.id && file.url && !fileIds.includes( file.id ) )
			.map( file => createBlock( 'core/file', {
				fileName: file.title,
				href: file.url,
				id: file.id,
				textLinkHref: file.url,
			} ) );

		if ( newBlocks.length > 0 ) {
			insertBlocks( newBlocks, undefined, clientId );
		}
	}

	onUploadError( message ) {
		const { noticeOperations } = this.props;
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
	}

	render() {
		const {
			className,
			innerBlocks,
			isSelected,
			noticeUI,
		} = this.props;

		return (
			<div className={ className }>
				{ ( innerBlocks.length === 0 || isSelected ) &&
					<MediaPlaceholder
						icon={ <BlockIcon icon={ icon } /> }
						labels={ {
							title: __( 'Card Catalog' ),
							instructions: __( 'Drag files, upload new ones or select files from your library.' ),
						} }
						onSelect={ this.onSelectFiles }
						notices={ noticeUI }
						onError={ this.onUploadError }
						accept="*"
						isAppender
						multiple
					/>
				}

				<InnerBlocks
					allowedBlocks={ [ 'core/file' ] }
					renderAppender={ false }
					templateInsertUpdatesSelection={ false }
				/>
			</div>
		);
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const {
			getBlockRootClientId,
			getBlockSelectionStart,
			getBlocksByClientId,
		} = select( 'core/block-editor' );

		const innerBlocks = getBlocksByClientId( props.clientId )[ 0 ].innerBlocks;
		const parentClientId = getBlockRootClientId( getBlockSelectionStart() );
		const fileIds = getBlocksByClientId( props.clientId )[ 0 ].innerBlocks.map( file => file.attributes.id );

		return {
			fileIds,
			getBlocksByClientId,
			hasInnerBlocks: innerBlocks.length > 0,
			innerBlocks,
			isSelected: props.isSelected || props.clientId === parentClientId,
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			insertBlocks,
		} = dispatch( 'core/block-editor' );

		return {
			insertBlocks,
		};
	} ),
	withNotices,
] )( CardCatalogEdit );