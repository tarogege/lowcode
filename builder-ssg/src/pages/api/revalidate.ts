export default async function handler(req: any, res: any) {
  const { id } = req.query;
  try {
    await res.revalidate(`/${id}`);
    return res.json({ revalidated: true });
  } catch (err) {
    console.log(err, 'err')
    return res.status(500).send('Error revalidating');
  }
}