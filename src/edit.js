/**
 * External dependencies
 */
import classnames from 'classnames';

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

	updateInnerAttributes( blockName, newAttributes ) {
		const { innerBlocks, updateBlockAttributes } = this.props;

		innerBlocks.forEach( item => {
			if ( item.name === blockName ) {
				updateBlockAttributes( item.clientId, newAttributes );
			}
		} );
	}

	onSelectFiles( files ) {
		const {
			clientId,
			fileIds,
			insertBlocks,
		} = this.props;

		const extToDashicon = ( filePath ) => {
			if ( filePath.match( /\.(zip|tar|gz)/i ) ) {
				return 'dashicons-media-archive';
			}

			if ( filePath.match( /\.(webmm|mpg|mp2|mpeg|mpe|mpv|ogg|mp4|m4p|m4v|avi|wmv|mov|qt|flv|swf)/i ) ) {
				return 'dashicons-media-video';
			}

			if ( filePath.match( /\.(wav|aiff|mp3|aac|ogg|wma|flac|alac|wma)/i ) ) {
				return 'dashicons-media-audio';
			}

			if ( filePath.match( /\.(csv|xls|xlsx)/i ) ) {
				return 'dashicons-media-spreadsheet';
			}

			return 'dashicons-media-default';
		};

		const newBlocks = files
			.filter( file => file && file.id && file.url && !fileIds.includes( file.id ) )
			.map( file => {
				return createBlock( 'core/file', {
					className: classnames( 'dashicons-before', extToDashicon( file.url ) ),
					fileName: file.title,
					href: file.url,
					id: file.id,
					textLinkHref: file.url,
					showDownloadButton: false,
				} );
			} );

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
			hasInnerBlocks,
			isSelected,
			noticeUI,
		} = this.props;

		return (
			<div className={ className }>
				{ ( ! hasInnerBlocks || isSelected ) &&
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
						isAppender={ hasInnerBlocks }
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
		const fileIds = innerBlocks.map( file => file.attributes.id );

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
			updateBlockAttributes,
		} = dispatch( 'core/block-editor' );

		return {
			insertBlocks,
			updateBlockAttributes,
		};
	} ),
	withNotices,
] )( CardCatalogEdit );