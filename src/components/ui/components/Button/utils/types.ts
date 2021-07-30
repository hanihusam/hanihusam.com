interface ButtonBaseProps {
  /** Renders the loading state of button. */
  isLoading?: boolean
  /** Changes the text that renders when the button is loading. Defaults to `"Memuat..."` */
  loadingText?: string
}

export type ButtonProps = ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>
