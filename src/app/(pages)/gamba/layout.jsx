/**
 * @file layout.jsx
 * @brief Layout component for wrapping content for wordle home page.
 */

/**
 * Metadata for the layout.
 * @var {Object} metadata
 * @property {string} title - The title of the Register page.
 * @property {string} description - A brief description of the Register page.
 */
export const metadata = {
    title: 'Wordle - gamba',
    description: 'gamba gamba gamba',
  }
  
  /**
   * Layout component that wraps its children for the Register page.
   * 
   * @function Layout
   * @param {Object} props - React component props.
   * @param {ReactNode} props.children - The children components or content to be wrapped.
   * @returns {ReactNode} The children wrapped inside a React fragment.
   */
  export default function Layout({ children }) {
    return (
      <>
        {children}
      </>
    )
  }