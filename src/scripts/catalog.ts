const controls = document.querySelector<HTMLElement>('.catalog-controls');
const input = document.querySelector<HTMLInputElement>('#tool-query');
if (controls && input) {
  controls.hidden = false;
  document.querySelector<HTMLElement>('.category-anchors')!.hidden = true;
  const buttons = [
    ...controls.querySelectorAll<HTMLButtonElement>('[data-category]'),
  ];
  const groups = [...document.querySelectorAll<HTMLElement>('[data-group]')];
  const validCategories = new Set(buttons.map((b) => b.dataset.category));
  let category = 'all';
  function render() {
    const terms = input!.value
      .trim()
      .toLocaleLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    let count = 0;
    for (const group of groups) {
      let visible = 0;
      group
        .querySelectorAll<HTMLElement>('[data-resource]')
        .forEach((resource) => {
          const match =
            (category === 'all' || group.dataset.group === category) &&
            terms.every((term) => resource.dataset.search!.includes(term));
          resource.hidden = !match;
          if (match) visible++;
        });
      group.hidden = visible === 0;
      count += visible;
    }
    buttons.forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.category === category)),
    );
    document.querySelector('#catalog-status')!.textContent =
      `显示 ${count} / ${document.querySelectorAll('[data-resource]').length} 项资源`;
    document.querySelector<HTMLElement>('.catalog-empty')!.hidden = count !== 0;
  }
  function restore() {
    const params = new URL(location.href).searchParams;
    input!.value = params.get('q') ?? '';
    const requested = params.get('category') ?? 'all';
    category = validCategories.has(requested) ? requested : 'all';
    render();
  }
  function commit() {
    const url = new URL(location.href);
    const query = input!.value.trim();
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    if (category !== 'all') url.searchParams.set('category', category);
    else url.searchParams.delete('category');
    if (url.href !== location.href) history.pushState(null, '', url);
    render();
  }
  // Typing previews results; submitting records a shareable history entry.
  input.addEventListener('input', render);
  document.querySelector('#tool-search')!.addEventListener('submit', (e) => {
    e.preventDefault();
    commit();
  });
  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      category = b.dataset.category!;
      commit();
    }),
  );
  function reset() {
    input!.value = '';
    category = 'all';
    commit();
    input!.focus();
  }
  document.querySelector('#clear-catalog')!.addEventListener('click', reset);
  document.querySelector('#reset-empty')!.addEventListener('click', reset);
  window.addEventListener('popstate', restore);
  restore();
}
