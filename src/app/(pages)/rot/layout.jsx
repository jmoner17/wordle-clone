export const metadata = {
    title: 'WordleROT - fortnite',
    description: 'ROTMAXXING',
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