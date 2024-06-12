/**
 * Adds a tooltip to an HTML element.
 * 
 * Kasutamine:
 * import { tooltip } from "$lib/script/tooltip.js";
 * <span use:tooltip={"pop upi tekst on siin!"}>rohkem valikuid</span> 
 * 
 * ++ style:
 * :global(.tooltip) {
        white-space: nowrap;
        position: relative;
        padding-top: 0.35rem;
        cursor: pointer;
        border-bottom: 1px solid currentColor;
	}
	
	
	:global(#tooltip) {
		position: absolute;
		bottom: 100%;
		right: 0.78rem;
		transform: translate(50%, 0);
		padding: 0.2rem 0.35rem;
		background: #CFFFCB;
		border-radius: 0.25rem;
		filter: drop-shadow(0 1px 2px hsla(0, 0%, 0%, 0.2));
		width: max-content;
        padding: 8px 12px;
	}
	
	:global(.tooltip:not(:focus) #tooltip::before) {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		width: 0.6em;
		height: 0.25em;
		background: inherit;
		clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
	}
 * 
 * 
 * @param {HTMLElement} node - The element to attach the tooltip to.
 * @param {string} params - The tooltip text to display.
 * @returns {{ destroy: () => void }} An object with a destroy method for cleanup.
 */
export function tooltip(node, params) {
    // Add initial styles and attributes to the node
    node.classList.add('tooltip');
    node.setAttribute('tabindex', '0'); // tabindex should be a string

    /**
     * Handles the focus event to show the tooltip.
     */
    function handleFocus() {
        // Create a tooltip element and append it to the node
        const child = document.createElement('span');
        child.textContent = params;
        child.setAttribute('id', 'tooltip');
        node.appendChild(child);

        // Add event listeners for mouse leave and blur
        node.addEventListener('mouseleave', handleBlur);
        node.addEventListener('blur', handleBlur);

        // Remove event listeners for mouse enter and focus to avoid duplicate listeners
        node.removeEventListener('mouseenter', handleFocus);
        node.removeEventListener('focus', handleFocus);
    }

    /**
     * Handles the blur event to hide the tooltip.
     */
    function handleBlur() {
        // Remove the tooltip element if it exists
        const tooltipElement = node.querySelector('#tooltip');
        if (tooltipElement) {
            node.removeChild(tooltipElement);
        }

        // Remove event listeners for mouse leave and blur
        node.removeEventListener('mouseleave', handleBlur);
        node.removeEventListener('blur', handleBlur);

        // Re-add event listeners for mouse enter and focus
        node.addEventListener('mouseenter', handleFocus);
        node.addEventListener('focus', handleFocus);
    }

    // Initial event listeners for showing the tooltip
    node.addEventListener('mouseenter', handleFocus);
    node.addEventListener('focus', handleFocus);

    return {
        /**
         * Cleanup function to remove event listeners and tooltip styles.
         */
        destroy() { // Changed from 'onDestroy' to 'destroy'
            node.classList.remove('tooltip');
            node.removeEventListener('mouseenter', handleFocus);
            node.removeEventListener('focus', handleFocus);
            node.removeEventListener('mouseleave', handleBlur);
            node.removeEventListener('blur', handleBlur);
        }
    };
}
