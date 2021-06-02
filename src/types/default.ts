export interface SiteAuthor {
  name: string
  description: string
  website: string
  avatar: string
  url: { [key: string]: string }
  email: string
}

export interface SiteMetadata {
  title: string
  description: string
  siteUrl: string
  flavourText?: string
  author: SiteAuthor
}
