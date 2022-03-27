//STRINGS

String.prototype.append = function(str: string): string {
    return (this + ' ' + str)
}

String.prototype.appendNoSpace = function(str: string): string {
    return (this + str)
}

String.prototype.capitalize = function(): string {
    return this.replace(this[0], this[0].toLocaleUpperCase())
}

String.prototype.caseCompare = function(str: string): boolean {
    return str.toLocaleLowerCase() === this.toLocaleLowerCase() || str.toLowerCase() === this.toLowerCase() || str === this
}

String.prototype.caseCompare = function(...str: string[]): boolean {
    return str.some(s => s.toLocaleLowerCase() === this.toLocaleLowerCase() || s.toLowerCase() === this.toLowerCase() || s === this)
}

String.prototype.getURLParameters = function(): string[] {
    return (this.match(/([^?=&]+)(=([^&]*))/g) || []).reduce((acc, val) => ((acc[val.slice(0, val.indexOf('='))] = val.slice(val.indexOf('=') + 1)), acc), {})
}

String.prototype.mask = function(num = 4, mask = '*'): string { return this.slice(-num).padStart(this.length, mask) }

String.prototype.wordWrap = function(max: number, br: string = '\n'): string {
    return this.replace(new RegExp(`(?![^\\n]{1,${max}}$)([^\\n]{1,${max}})\\s`, 'g'), '$1' + br)
}

//NUMBER

Number.prototype.isPrime = function(): boolean {
    const boundary = Math.floor(Math.sqrt(this))
    for (let i = 2; i <= boundary; i++) if (this % i === 0) return false
    return this >= 2
}

Number.prototype.inRange = function(min: number, max: number): boolean {
    if (min > max) {
        const temp = min
        min = max
        max = temp
    }

    if (this >= min && this <= max) return true
    else return false
}

//BOOLEAN

Boolean.prototype.randomBoolean = function(): boolean {
    return Math.random() >= 0.5
}

//ARRAYS

Array.prototype.arrayEmpty = function(): boolean { return (!this || !this.length) }

Array.prototype.arrayRandom = function(): any { return this[this.randomRange(0, this.length)] }

Array.prototype.chunk = function(size: number): any[] {
    const newArr: any[] = []
    for (let i = 0; i < this.length; i+= size) newArr.push(this.slice(i, i + size))

    return newArr
}

Array.prototype.chunkNewLine = function(size: number): string[] {
    for (let i = 0; i < this.length; i += size) this[i] += '\n'
    return this
}

Array.prototype.coalesce = function(): any { return this.find((v: any) => ![undefined, null].includes(v)) }

Array.prototype.combine = function(obj1: any[], obj2: any[], prop: any) {
    return Object.values([...obj1, ...obj2].reduce((acc, val) => {
        if (val[prop])
            acc[val[prop]] = acc[val[prop]] ? { ...acc[val[prop]], ...val } : { ...val }
            return acc
    }, {}))
}

Array.prototype.compact = function(): any[] { 
    const newArr = [...this]
    for (let i = 0; i < this.length; i++) if (!this[i]) this[i] = newArr.pop()
    return this
}

Array.prototype.findLast = function(fn: Function): any { return this.filter(fn).pop() }

Array.prototype.findLastIndex = function(fn: Function): any {
    return (this
        .map((val: any, i: number) => [i, val])
        .filter(([i, val]) => fn(val, i, this))
        .pop() || [-1])[0]
}

Array.prototype.getArrDifferences = function(arr: any[]): any[] {
    return this.filter((v: any, i: number) => {
        if (!arr[i]) return v
        if (arr[i] && v !== arr[i]) return v
    })
}

Array.prototype.getObjDifferences = function(obj: Array<Object>, ...props: string[]): Object[] {
    const objKeys = Object.keys(this)
    const targetObjKeys = Object.keys(obj)

    if (objKeys.some(k => !k.caseCompare(...props)) || targetObjKeys.some(k => !k.caseCompare(...props))) throw new Error('Not all entered props exist in both objects.')


    const newObj1 = this.map(({ ...props }) => { return { ...props }})
    const newObj2 = obj.map(({ ...props }) => { return { ...props }})

    Object.keys

    const uniqueProps = newObj2.map(({ ...props}) => {
        return props
    })
    .filter(props => props)

    return obj
}

/*
        const oldPerms = oldChannel.permissionOverwrites.cache.map(({ id, type, allow, deny }) => { return { id, type, allow, deny }})
        const newPerms = newChannel.permissionOverwrites.cache.map(({ id, type, allow, deny }) => { return { id, type, allow, deny }})

        const uniqueIDs = newPerms
            .map(({ id, allow, deny }) => {
                const op = oldPerms.find(p => p.id === id)
                if (allow.bitfield !== op.allow.bitfield && deny.bitfield !== op.deny.bitfield) return id
            })
            .filter(uid => uid)

        Object.prototype.renameKeys = function(keysMap: Object): Object { 
            return Object.keys(this).reduce((acc: any, key: any) => ({...acc, ...{[ keysMap[key] || key]: this[key] }}), {})
        }
*/

Array.prototype.hasOnlyOne = function(fn: Function): boolean { return this.filter(fn).length === 1 }

Array.prototype.hasMany = function(fn: Function): boolean { return this.filter(fn).length > 1 }

Array.prototype.omitBy = function(fn: Function): any {
    return Object.keys(this)
        .filter(k => !fn(this[k], k))
        .reduce((acc, key) => ((acc[key] = this[key]), acc), {})
}

Array.prototype.paginate = function(page: number = 1, perPage: number = 10) {
    const maxPages = Math.ceil(this.length / perPage)
    page === 0 ? page = 1 : void 0

    page = !this.arrayEmpty() ? page || 1 : 1

    const end = page * perPage
    const start = end - perPage

    return [this.slice(start, end), maxPages || null]
}

Array.prototype.pickBy = function(fn: Function): any {
    return Object.keys(this)
        .filter(k => fn(this[k], k))
        .reduce((acc, key) => ((acc[key] = this[key]), acc), {})
}

Array.prototype.randomRange = function(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * ((max - min) + 1)) + min
}

Array.prototype.randomWeighted = function(weights: number[]): number {
    const roll = Math.random()
    return this [
        weights
            .reduce((acc, currVal, i) => (i === 0 ? [currVal] : [...acc, acc[acc.length - 1] + currVal]), [])
            .findIndex((val, i, obj) => roll >= (i === 0 ? 0 : obj[i - 1]) && roll < val)
    ]
}

Array.prototype.takeUntil = function(fn: Function): any { for (const [i, val] of this.entries()) if (fn(val)) return this.slice(0, i) }

//getDifferences

//OBJECTS

Object.prototype.assertValidKeys = function(keys: string[]): boolean { return Object.keys(this).every(key => keys.includes(key)) }

Object.prototype.compact = function(): any {
    const data = Array.isArray(this) ? this.filter(Boolean) : this
    return Object.keys(data).reduce((acc, key) => {
        const value = data[key]
        if (value) acc[key] = typeof value === 'object' ? value.compact() : value
        return acc
    }, Array.isArray(this) ? [] : {})
}

Object.prototype.dig = function(target: any): any {
    return target in this ? 
        this[target] :
        Object.values(this).reduce((acc, val) => {
            if (acc !== undefined) return acc
            if (typeof val === 'object') return (val as Object).dig(target)
        }, undefined)
}

Object.prototype.getMethods = function(): any {
    const props = new Set<string>()

    do { Object.getOwnPropertyNames(this).map(i => props.add(i)) } while ((this === Object.getPrototypeOf(this)))

    return [...props.keys()].filter(i => i)
}

Object.prototype.getSelection = function(obj: Object, ...selectors: any): any[] {
    return [...selectors].map(s => {
        return s
            .replace(/[([^[]]*)]/g, '.$1.')
            .split('.')
            .filter((t: string) => t !== '')
            .reduce((prev: any, curr: any) => prev && prev[curr], obj)
    })
}

Object.prototype.getType = function() { return (this === undefined ? 'undefined' : this === null ? 'null' : this.constructor.name) }

Object.prototype.isAyncFunc = function(): boolean {  return Object.prototype.toString.call(this) === '[object AsyncFunction]' }

Object.prototype.isFunc = function(): boolean { return typeof this === 'function' }

Object.prototype.isObject = function(): boolean { return (this && this.constructor === Object) }

Object.prototype.isObjectEmpty = function(): boolean { return (!this || !(Object.keys(this)) || !this.length) }

Object.prototype.isOfType = function(type: any): boolean { return ![, null].includes(this) && this.constructor === type }

Object.prototype.isNil = function(): boolean { return this === undefined || this === null }

Object.prototype.omit = function(keyArr: any[]): Object { 
    return Object.keys(this)
        .filter(k => !keyArr.includes(k))
        .reduce((acc: any, key: any) => ((acc[key] = this[key]), acc), {})
}

Object.prototype.pick = function(keyArr: any[]): Object { return keyArr.reduce((acc: any, curr: any) => (curr in this && (acc[curr] = this[curr]), acc), {}) }

Object.prototype.renameKeys = function(keysMap: Object): Object { 
    return Object.keys(this).reduce((acc: any, key: any) => ({...acc, ...{[ keysMap[key] || key]: this[key] }}), {})
}

Object.prototype.shallowClone = function(obj: Object): Object { return Object.assign(this, obj) }

//FUNCTION

Function.prototype.mostPerformant = function(fns: Function[], iterations: 10) {
    const times = fns.map(fn => {
        const before = performance.now()
        for (let i = 0; i < iterations; i++) fn()
        return performance.now() - before
    })
    return times.indexOf(Math.min(...times))
}

Function.prototype.timeTaken = function(...args): number {
    console.time('timeTaken')
    const r = this.call(args)
    console.timeEnd('timeTaken')
    return r
}

//DATES

Date.prototype.getTimeFromNow = function(time: number): Date { return new Date(Date.now() - time) }