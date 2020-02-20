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

        // Add search input
        const searchInput = document.createElement( 'input' );
        searchInput.setAttribute( 'class', 'search' );
        searchInput.setAttribute( 'placeholder', __( 'Search', 'card-catalog' ) );
        element.prepend( searchInput );

        // Add sort by name button
        const nameSort = document.createElement( 'button' );
        nameSort.innerHTML = __( 'Sort by Name', 'card-catalog' );
        nameSort.setAttribute( 'class', 'sort' );
        nameSort.setAttribute( 'data-sort', 'name' );
        element.prepend( nameSort );

        const cardCatalog = new List( wrapperID, {
            valueNames: [
                'name',
                { name: 'href', attr: 'href' }
            ]
        } );

        // Add filter archives button
        const filterArchive = document.createElement( 'button' );
        filterArchive.innerHTML = __( 'Archives', 'card-catalog' );
        element.prepend( filterArchive );

        filterArchive.addEventListener( 'click', () => {
            cardCatalog.filter( item => item.values().href.match( /\.(zip|tar|gz)/i ) );
        } );

        // Add filter documents button
        const filterDocument = document.createElement( 'button' );
        filterDocument.innerHTML = __( 'Documents', 'card-catalog' );
        element.prepend( filterDocument );

        filterDocument.addEventListener( 'click', () => {
            cardCatalog.filter( item => item.values().href.match( /\.(doc|docx|docm|dotm|oth|odt|pdf|rtf|bin|csv|xps|xls|xlsx)/i ) );
        } );

        // Add filter images button
        const filterImage = document.createElement( 'button' );
        filterImage.innerHTML = __( 'Images', 'card-catalog' );
        element.prepend( filterImage );

        filterImage.addEventListener( 'click', () => {
            cardCatalog.filter( item => item.values().href.match( /\.(bmp|gif|ico|jpeg|jpg|png|svg|ti|tiff|webp)/i ) );
        } );

        // Add filter reset button
        const filterAll = document.createElement( 'button' );
        filterAll.innerHTML = __( 'All', 'card-catalog' );
        element.prepend( filterAll );

        filterAll.addEventListener( 'click', () => {
            cardCatalog.filter( () => true );
        } );
    } );
} );