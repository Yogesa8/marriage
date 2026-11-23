import { useRef } from 'react'
import useInView from '../hooks/useInView'

/** Any element with the original `.rv` scroll-reveal: gets `.is-in` when it scrolls into view */
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  const cls = [className, 'rv', inView && 'is-in'].filter(Boolean).join(' ')
  return (
    <Tag ref={ref} className={cls} {...rest}>
      {children}
    </Tag>
  )
}
