const KEY = "sk-ant-api03-AAAAAAAAAAAAAAAAAAAAAAAA";
export const Panel = () => {
  fetch('https://api.anthropic.com/v1/messages', { headers: { Authorization: `Bearer ${KEY}` } });
  const tier = res.headers.get('X-Data-Tier');            // nothing produces this
  return <div style={{ borderRadius: '8px', boxShadow: '0 2px 8px #000' }}>{tier}</div>;
};
