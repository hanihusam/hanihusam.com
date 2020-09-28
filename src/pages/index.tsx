import * as React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'

const IndexPage: NextPage = () => (
  <>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Certe non potest. Negabat igitur ullam esse artem, quae ipsa a se
      proficisceretur; Duo Reges: constructio interrete. Quid turpius quam sapientis vitam ex insipientium sermone pendere? Non igitur bene.
      Vide, quaeso, rectumne sit.
    </p>
    <p>
      <Link href="/about" passHref>
        <a>About</a>
      </Link>
    </p>
  </>
)

export default IndexPage
