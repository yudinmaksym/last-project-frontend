export default ({ children }) => (
  <div className="auth-layout">
    {children}
    <div className="d-table m-auto">
      <img
        className="d-inline-block align-top mr-4 ml-3 pb-4"
        style={{ maxWidth: '150px', position: 'absolute', bottom: 0, right:0 }}
        src={'/img/logo-transparent.png'}
        alt=""
      />
    </div>
  </div>
)