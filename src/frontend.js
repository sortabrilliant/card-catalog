/**
 * External dependencies
 */
import { startCase } from 'lodash';
import List from 'list.js';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { iconExtensions, filterUnmatchedIcons } from './extension-helpers';

document.addEventListener( 'DOMContentLoaded', () => {
    const cardCatalogs = document.getElementsByClassName( 'wp-block-sortabrilliant-card-catalog' );

    [ ...cardCatalogs ].forEach( ( element, index ) => {
        // Wrap file blocks
        const wrapper = document.createElement( 'div' );
        const wrapperID = `card-catalog-${index}`;

        element.setAttribute( 'id', wrapperID );
        wrapper.setAttribute( 'class', 'list' );

        [ ...element.children ].forEach( child => {
            child.children[ 0 ].classList.add( 'name', 'href' );
            child.children[ 0 ].setAttribute( 'download', '' );
            wrapper.appendChild( child );
        } );
        element.appendChild( wrapper );

        const parser = new DOMParser();

        // Create filter select control
        const domFilterDropdown = [
            '<div class="sortabrilliant-card-catalog__filter">',
            `<label>${__( 'Filter by', 'card-catalog' )}</label>`,
            '<select class="sortabrilliant-card-catalog__filter--field">',
            `<option value="all">${__( 'All', 'card-catalog' )}</option>`,
            '</select>',
            '</div>',
        ];

        // Only output filters for file types that exist.
        const fileBlockPaths = Object.values( wrapper.children ).map( node => node.firstChild.href );
        filterUnmatchedIcons( fileBlockPaths ).forEach( iconSlug => {
            const iconLabel = iconSlug.replace( 'fa-file-', '' );
            domFilterDropdown.splice( 4, 0, `<option value="${iconLabel}">${startCase( iconLabel )}</option>` );
        } )

        element.prepend(
            parser.parseFromString(
                domFilterDropdown.join( '' ), 'text/html'
            ).body.firstChild
        );

        // Add search input
        const searchInput = document.createElement( 'input' );
        searchInput.setAttribute( 'class', 'search wp-block-search__input' );
        searchInput.setAttribute( 'type', 'search' );
        searchInput.setAttribute( 'placeholder', __( 'Search', 'card-catalog' ) );

        // Add search label
        const searchLabel = document.createElement( 'label' );
        searchLabel.setAttribute( 'class', 'search wp-block-search__label' );
        searchLabel.innerText = __( 'Search', 'card-catalog' );

        element.prepend( searchInput );
        element.prepend( searchLabel );

        const cardCatalog = new List( wrapperID, {
            valueNames: [
                'name',
                { name: 'href', attr: 'href' }
            ]
        } );

        // Setup the card catalog filters when select control changes.
        element.children[ 2 ].lastChild.addEventListener( 'change', event => {
            event.preventDefault();
            cardCatalog.filter( item => item.values().href.match( iconExtensions[ `fa-file-${event.target.value}` ] ) );
        } );
    } );
} );