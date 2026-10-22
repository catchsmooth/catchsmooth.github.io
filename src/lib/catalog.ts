import { getCollection } from 'astro:content';
export async function getCatalog() {
  const resources = await getCollection('resources');
  const guides = (await getCollection('guides')).sort(
    (a, b) => a.data.order - b.data.order,
  );
  const ids = new Set(resources.map((resource) => resource.id));
  for (const guide of guides)
    for (const id of guide.data.resources) {
      if (!ids.has(id))
        throw new Error(`专题 ${guide.id} 引用了不存在的资源 ${id}`);
    }
  return { resources, guides };
}
