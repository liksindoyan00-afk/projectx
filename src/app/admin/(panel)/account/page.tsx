import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { addAdmin, changePassword, removeAdmin } from '../../actions';
import { ActionForm, ConfirmButton, SubmitButton } from '../../ui';
import { fmtDate } from '../../format';

export default async function Account() {
  const me = await requireAdmin();
  const users = await prisma.adminUser.findMany({ orderBy: { createdAt: 'asc' } });
  return (
    <>
      <div className="a-top">
        <div>
          <h1>Account & team</h1>
          <p>Signed in as {me.email}.</p>
        </div>
      </div>
      <div className="detail">
        <div className="card">
          <h2>People with access</h2>
          <p className="hint">Everyone here can read enquiries and edit the site figures.</p>
          <table className="t">
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <b>{u.name}</b>
                    <div className="sub">{u.email}</div>
                  </td>
                  <td className="sub">{u.lastLoginAt ? `Last sign-in ${fmtDate(u.lastLoginAt)}` : 'Never signed in'}</td>
                  <td>
                    {u.id !== me.uid && (
                      <form action={removeAdmin}>
                        <input type="hidden" name="id" value={u.id} />
                        <ConfirmButton label="Remove" />
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 style={{ marginTop: 24 }}>Add a person</h2>
          <ActionForm action={addAdmin} resetOnSuccess className="grid cols-2">
            <label className="f">
              <span>Name</span>
              <input className="in" name="name" required />
            </label>
            <label className="f">
              <span>Email</span>
              <input className="in" type="email" name="email" required />
            </label>
            <label className="f">
              <span>
                Temporary password <small>· 10+ characters, share it privately</small>
              </span>
              <input className="in" type="text" name="password" minLength={10} required autoComplete="off" />
            </label>
            <div style={{ alignSelf: 'end' }}>
              <SubmitButton>Give access</SubmitButton>
            </div>
          </ActionForm>
        </div>
        <div className="card">
          <h2>Change your password</h2>
          <ActionForm action={changePassword} resetOnSuccess className="grid">
            <label className="f">
              <span>Current password</span>
              <input className="in" type="password" name="current" autoComplete="current-password" required />
            </label>
            <label className="f">
              <span>New password</span>
              <input className="in" type="password" name="next" autoComplete="new-password" minLength={10} required />
            </label>
            <div>
              <SubmitButton>Change password</SubmitButton>
            </div>
          </ActionForm>
        </div>
      </div>
    </>
  );
}
