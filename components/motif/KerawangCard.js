/**
 * KerawangCard — kartu standar dengan aksen Pucuk Rebung (segita emas).
 * Wrapper ringan: menerima className/style/anak apa pun — tidak mengubah API.
 */
export default function KerawangCard({ children, className = '', style, hover = true, ...rest }) {
  return (
    <div className={`kerawang-card ${className}`} style={{ padding: '18px 20px', ...style }} {...rest}>
      {children}
    </div>
  );
}