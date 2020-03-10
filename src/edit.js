/**
 * External dependencies
 */
import { startCase } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import {
	BlockIcon,
	InnerBlocks,
	MediaPlaceholder,
} from '@wordpress/block-editor';
import {
	Disabled,
	withNotices,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { default as icon } from './icon';
import { extensionToIcon, filterUnmatchedIcons } from './extension-helpers';

class CardCatalogEdit extends Component {
	constructor() {
		super( ...arguments );

		this.onSelectFiles = this.onSelectFiles.bind( this );
		this.onUploadError = this.onUploadError.bind( this );
	}

	onSelectFiles( files ) {
		const {
			attributes,
			clientId,
			fileIds,
			insertBlocks,
		} = this.props;

		const newBlocks = files
			.filter( file => file && file.id && file.url && !fileIds.includes( file.id ) )
			.map( file => {
				return createBlock( 'core/file', {
					className: classnames( 'far', extensionToIcon( file.url ) ),
					fileName: file.title,
					href: file.url,
					id: file.id,
					textLinkHref: file.url,
					downloadButtonText: __( 'Download', 'card-catalog' ),
					showDownloadButton: attributes.showDownloadButton,
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

		filterUnmatchedIcons(
			this.props.innerBlocks.map( file => file.attributes.href )
		);

		return (
			<div className={ className }>
				{ hasInnerBlocks &&
					<Disabled className="wp-block-search">
						<div className="wp-block-search__label">{ __( 'Search', 'card-catalog' ) }</div>
						<input className="wp-block-search__input" placeholder={ __( 'Search', 'card-catalog' ) } />
						<div className="sortabrilliant-card-catalog__filter">
							<label htmlFor="card-catalog-filter">{ __( 'Filter by', 'card-catalog' ) }</label>
							<select id="card-catalog-filter" className="sortabrilliant-card-catalog__filter--field">
								{ filterUnmatchedIcons(
									this.props.innerBlocks.map( file => file.attributes.href )
								).map( iconSlug => {
									const iconLabel = iconSlug.replace( 'fa-file-', '' );
									return (
										<option key={ iconLabel } value={ iconLabel }>{ startCase( iconLabel ) }</option>
									);
								} ) }
							</select>
						</div>
					</Disabled>
				}

				{ ( !hasInnerBlocks || isSelected ) &&
					<MediaPlaceholder
						icon={ <BlockIcon icon={ icon } /> }
						labels={ {
							title: __( 'Card Catalog', 'card-catalog' ),
							instructions: __( 'Drag files, upload new ones or select files from your library.', 'card-catalog' ),
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
		} = dispatch( 'core/block-editor' );

		return {
			insertBlocks,
		};
	} ),

	withNotices,
] )( CardCatalogEdit );