const StepItemDefault = {
  id: '',
  title: '', // title show in step nav
  component: '', // stem content component,
  disabled: false,
  _active: false,
  _visited: false,
  _initialized: false,
  _open: false,
  validator () {},
  onFinish () {},
  children: []
}

export default function parseStepItem (options) {
  if (options.children && options.children.length) {
    options.children = options.children.map(item => {
      if (!item.id) {
        item.id = 'step_' + Math.random()
      }
      delete item.children
      return Object.assign({}, StepItemDefault, item);
    })
  }
  if (!options.id) {
    options.id = 'step_' + Math.random()
  }
  return Object.assign({}, StepItemDefault, options);
}
