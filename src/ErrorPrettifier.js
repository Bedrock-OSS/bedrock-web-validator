import parse from 'json-to-ast'

export default class ErrorPrettifier {
	static prettify(json, error) {
		console.log(error)
		const settings = {
			loc: true,
			source: json,
		}

		let ast = parse(json, settings)
		let result = this.childByPath(ast, error.path || '/')
		result.message = error.message
		console.log(result)
		return result
	}

	static childByPath(ast, path) {
		if (path === '' || path === '/') return ast.loc
		if (path.startsWith('/')) path = path.substr(1)
		let child = path.split('/')[0]
		path = path.substr(child.length)
		if (ast.type === 'Property') {
			ast = ast.value
		}
		if (ast.type === 'Object') {
			for (const c of ast.children) {
				if (c.key.value === child) return this.childByPath(c, path)
			}
		} else if (ast.type === 'Array') {
			return this.childByPath(ast.children[+child], path)
		}
	}
}
