/**
 * External dependencies
 */
import List from 'list.js';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

document.addEventListener( 'DOMContentLoaded', () => {
    const cardCatalogs = document.getElementsByClassName( 'wp-block-sortabrilliant-card-catalog' );

    [ ...cardCatalogs ].forEach( ( element, index ) => {
        // Wrap file blocks
        const wrapper = document.createElement( 'div' );
        const wrapperID = `card-catalog-${index}`;

        element.setAttribute( 'id', wrapperID );
        wrapper.setAttribute( 'class', 'list' );

        [ ...element.children ].forEach( child => {
            child.children[0].classList.add( 'name', 'href' );
            wrapper.appendChild( child );
        } );
        element.appendChild( wrapper );

        const filterWrapper = document.createElement( 'div' );

        // Add filter archives button
        const filterArchive = document.createElement( 'button' );
        filterArchive.innerHTML = __( 'Archives', 'card-catalog' );
        filterWrapper.prepend( filterArchive );

        // Add filter documents button
        const filterDocument = document.createElement( 'button' );
        filterDocument.innerHTML = __( 'Documents', 'card-catalog' );
        filterWrapper.prepend( filterDocument );

        // Add filter images button
        const filterImage = document.createElement( 'button' );
        filterImage.innerHTML = __( 'Images', 'card-catalog' );
        filterWrapper.prepend( filterImage );

        // Add filter reset button
        const filterAll = document.createElement( 'button' );
        filterAll.innerHTML = __( 'All', 'card-catalog' );
        filterWrapper.prepend( filterAll );

        const searchWrapper = document.createElement( 'div' );

        // Add sort by name button
        const nameSort = document.createElement( 'button' );
        nameSort.innerHTML = __( 'Sort by Name', 'card-catalog' );
        nameSort.setAttribute( 'class', 'sort' );
        nameSort.setAttribute( 'data-sort', 'name' );
        searchWrapper.prepend( nameSort );

        // Add search input
        const searchInput = document.createElement( 'input' );
        searchInput.setAttribute( 'class', 'search' );
        searchInput.setAttribute( 'placeholder', __( 'Search', 'card-catalog' ) );
        searchWrapper.prepend( searchInput );

        element.prepend( filterWrapper );
        element.prepend( searchWrapper );

        const cardCatalog = new List( wrapperID, {
            valueNames: [
                'name',
                { name: 'href', attr: 'href' }
            ]
        } );

        const addClickHandler = ( elm, regex ) => {
            elm.addEventListener( 'click', event => {
                event.preventDefault();
                cardCatalog.filter( item => item.values().href.match( regex ) );
            } );
        }

        addClickHandler( filterArchive, /\.(zip|tar|gz)/i );
        addClickHandler( filterDocument, /\.(doc|docx|docm|dotm|oth|odt|pdf|rtf|bin|csv|xps|xls|xlsx)/i );
        addClickHandler( filterImage, /\.(bmp|gif|ico|jpeg|jpg|png|svg|ti|tiff|webp)/i );
        addClickHandler( filterAll, /./i );
    } );
} );