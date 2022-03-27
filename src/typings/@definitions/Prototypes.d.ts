declare interface String {
    /**
     * @description Appends a string onto the end of another string (automatically adds a space) and returns the new string
     * @param str The characters to append to the end of the string
     * 
     * @returns The new string with appended characters
     */
    append(str: string): string
    /**
     * @description Appends a string onto the end of another string (does not add a space) and returns the new string
     * @param str The characters to append at the end of the string
     * 
     * @returns The new string with appended characters
     */
    appendNoSpace(str: string): string
    /**
     * @description Capitalizes a string so that it will start with a capital letter.
     * 
     * @returns The string with a capital letter as the first letter
     */
    capitalize(): string
    /**
     * @description Checks if an argument string is the same despite the case it is in
     * @param str The argument string to compare with
     * @example 'hi'.caseCompare('HI') // true
     * 
     * @returns True if the str is the same in any case
     */
    caseCompare(str: string): boolean
    /**
     * @description Checks if any of the argument string(s) are the same despite the case it is in
     * @param str The argument string to compare with
     * @example 'hi'.caseCompare('HI', 'HELLO', 'HENLO') //true
     * 
     * @returns True if any of the the argument(s) are the same in any case
     */
    caseCompare(...str: string[]): boolean
    /**
     * @description Returns a string array containing all the parameters used in a URL link
     * @example 'https://site.com/searchparameters/query=test&type=gif' => ['test', 'gif']
     * 
     * @returns A string array of the parameters
     */
    getURLParameters(): string[]
    /**
     * @description Replaces all but the last num characters with a mask to hide the inputted characters
     * @param num The number of characters to not replace with the mask
     * @param mask The character used to replace all the other characters
     * 
     * @returns A new masked string
     */
    mask(num: number, mask: string): string
    /**
     * @description Will return a new string where there is a new line escape character after every max characters
     * @param max The max number of characters before a new line is added
     * @param br The break used after every max chars
     * 
     * @returns A string with a new break after every fixed characters
     */
    wordWrap(max: number, br: string): string
}

declare interface Number {
    /**
     * @description Determines whether a provided number is a prime number or not
     * 
     * @returns True if the value is a prime number
     */
    isPrime(): boolean
    /**
     * @description Returns if the number is in the range of a minimum and max number
     * 
     * @returns True if the number is in the range of the minimum (inclusive) and maximum (inclusive)
     */
    inRange(min: number, max: number): boolean
}

declare interface Boolean {
    /**
     * @description Will retrieve a random value and convert that to either true/false
     * 
     * @returns A random true or false
     */
    randomBoolean(): boolean
}

declare interface Array<T> {
    /**
     * @description Returns whether the array is empty or not
     * 
     * @returns True if the array is empty, otherwise false
     */
    arrayEmpty(): boolean
    /**
     * @description Returns a random array element between the length of the array
     * 
     * @returns An array element
     */
    arrayRandom(): T
    /**
     * @description Returns a new array that splits an array into multiple arrays of a fixed size
     * @param size The size before splitting into a new array
     * 
     * @returns The split array that has been chunked (Unmutated)
     */
    chunk(size: number): string[]
    /**
     * @description Mutates the original array to add a new line after every specific amount of elements
     * @param size The maximum size an array can be before being chunked into a new line
     * 
     * @returns The chunked string array (Mutated)
     */
    chunkNewLine(size: number): string[]
    /**
     * @description Iterates through the array and finds the first defined, non-null argument
     * 
     * @returns The first element that is defined and not-null
     */
    coalesce(): T
    /**
     * @description Iterates through the array and finds the first defined, non-null or not matching any parameter
     * @param args The parameters that are included as well as undefined and null to check through the array with
     * 
     * @returns The first element that is defined, not-null and not equal to any args
     */
    coalesceCustom(...args: any): T
    /**
     * @description Creates a new object from 2 objects using a key to connect them both.
     * @param obj1 An object
     * @param obj2 An object
     * @param property The id/property to be used to link the 2 objects together
     * 
     * @returns A new object of combined properties
     */
    combine(obj1: T, obj2: S, property: any): S & T
    /**
     * @description Mutates the original array to remove all falsy values from the array
     * 
     * @returns Returns the array with all falsy values removed (Mutated)
     */
    compact(): T[]
    /**
     * @description Finds the last instance of a value if it exists in an array, otherwise returns undefined.
     * @param predicate A function that accepts up to three arguments.
     * @param thisArg The callback function if an arrow function is used
     * 
     * @returns The last instance of a value
     */
    findLast<S extends T>(predicate: (this: void, value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined
    /**
     * @description Finds the last instance of a value if it exists in an array, otherwise returns undefined
     * @param predicate A function that accepts up to three arguments.
     * @param thisArg The callback function if an arrow function is used
     * 
     * @returns The last instance of a value
     */
    findLast(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined
    /**
     * @description Finds the index of the last instance of a value if it exists in an array, otherwise returns -1
     * @param predicate A function that accepts up to three arguments.
     * @param thisArg The callback function if an arrow function is used
     * 
     * @returns The index of last instance of a value
     */
    findLastIndex(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): number
    /**
     * @description Omits duplicate entries between both arrays and returns a mutated array with both value A & B for entries with differences
     * @param arr The comparison array of data
     * 
     * @returns The array excluding duplicate entries and containing the differences
     */
    getArrDifferences(arr: T[]): T[]
    /**
     * @description Returns an object excluding duplicate data and returns an array of both objects containing their differences
     * @param obj The object being passed in
     * @param props A single/array of properties from the object to filter for
     * 
     * @returns An array of both objects excluding duplicate data & differences
     */
    getObjDifferences(obj, ...props): T[]
    /**
     * @description Checks using a predicate more than one element matches the predicate, otherwise false
     * @param predicate A function that accepts up to three arguments.
     * 
     * @returns True if more than one element matches the predicate, otherwise false
     */
    hasMany(predicate: Function): boolean
    /**
     * @description Checks using a predicate if only one element matches the predicate, otherwise false
     * @param predicate A function that accepts up to three arguments.
     * 
     * @returns True if only one element matches the predicate, otherwise false
     */
    hasOnlyOne(predicate: Function): boolean 
    /**
     * @description Returns a new object/array that returns everything omitted by the predicate
     * @param predicate A function that accepts up to three arguments.
     * @param thisArg The callback function if an arrow function is used
     * 
     * @returns A new object/array that contains all values that don't satisfy the predicate
     */
    omitBy<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[]
     /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments.
     * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
     */
    omitBy(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[]
    /**
     * @description Cuts an array into pages and returns data of an inputted page as well as the max pages unless it's empty.
     * @param page The page being queried, if 0 then this refers to all pages
     * @param perPage The amount of data that should be on each page of data
     * 
     * @returns A new array with 2 elements, first is the page of data from the original array (or all pages). Second is the max number of pages.
     */
    paginate(page: number, perPage: number): [data: T[], maxPages: number]
    /**
     * @description Returns a new object/array that returns everything satisfying the predicate
     * @param predicate A function that accepts up to three arguments.
     * @param thisArg The callback function if an arrow function is used
     * 
     * @returns A new object/array that contains all values that satisfy the predicate
     */
    pickBy<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S | S[]
    /**
     * @description Retrieves a random number between 2 inputted numbers
     * @param min The minimum value that can be randomly selected
     * @param max The maximum value that can be randomly selected
     * 
     * @returns a random number
     */
     randomRange(min: number, max: number): number
    /**
     * @description Returns a value from the original array by randomly selecting an element with probabilities
     * @param weights An array of probabilities of each array element
     * 
     * @returns A value from the original array
     */
    randomWeighted(weights: number[]): any
    /**
     * @description From left to right, will omit items from the array that are false until the predicate is true
     * @param predicate A function that accepts up to three arguments.
     * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
     * 
     * @returns A new array from where the predicate was true and onwards
     */
    takeUntil<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[]
    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param predicate A function that accepts up to three arguments.
     * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
     */
    takeUntil(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[]
}

declare interface Object {
    /**
     * @description Asserts whether the keys passed as an argument exist in the object or not
     * @param keys The keys to check for
     * 
     * @returns True if the object contains all keys, else false
     */
    assertValidKeys(keys: string[]): boolean
    /**
     * @description Mutates the original object to depply remove all falsy values
     * 
     * @returns The object without any falsy values
     */
    compact(): T
    /**
     * @description Deeply searches a (nested) object for a key and returns the value
     * @param target A target key being searched for
     * 
     * @returns A target value from a nested JSON object
     */
    dig(target: any): T
    /**
     * @description Takes in an object and returns all the methods and properties attached to that object's type
     * 
     * @returns All the properties and methods of the object
     */
    getMethods(): T
    /**
     * @description Retrieves properties from an object using provided selectors (keys)
     * @param obj The object to get the properties from
     * @param selectors The key selectors to search the object for
     * 
     * @returns A array of all the selected properties
     */
    getSelection(obj: Object, ...selectors: any): T[]
    /**
     * @description Gets the constructor type of a variable/object
     * 
     * @returns The native type of the variable/object
     */
    getType(): T
    /**
     * @description Retrieves a boolean value to state whether the provided object is an asynchronous function
     * 
     * @returns True if the object is an asynchronous function
     */
    isAyncFunc(): boolean
    /**
     * @description Retrieves a boolean value to state whether the provided boject is a function
     * 
     * @returns True if the object is a function, else false
     */
    isFunc(): boolean
    /**
     * @description Determines if a type is an object or not
     * 
     * @returns True if the input's native type is an object, else false
     */
    isObject(): boolean
    /**
     * @description Returns a boolean value to determine whether an object/array has no values or is empty
     * 
     * @returns True if the array is empty or has no inputs inside, false otherwise
     */
    isObjectEmpty(): boolean
    /**
     * @description Will return true or false depending on if the variable has the same constructor type as the type passed in
     * @param type The constructor type to check for
     * @example 'x'.isOfType(string) //true
     * 
     * @returns True if the value is of the same passed in type
     */
    isOfType(type: any): boolean
    /**
     * @description Returns a boolean value to determine if a value is undefined/null
     * 
     * @returns True if the value is undefined OR null
     */
    isNil(): boolean
    /**
     * @description Returns an object with all key-value pairs from keyArr omitted from the object
     * @param keyArr The keys to find the key-value pairs to omit from the object
     * 
     * @returns A new object with the omitted key-value pairs
     */
    omit(keyArr: any[]): Object
    /**
     * @description Returns an object with only the key-value pairs from keyArr
     * @param keyArr The keys to find the key-value pairs to pick from the object
     * 
     * @returns A new object with the picked key-value pairs
     */
    pick(keyArr: any[]): Object
    /**
     * @description Renames the keys in an object
     * @param keysMap The keys map object for renaming keys to a new value
     * @example { name: 'Bill' }.renameKeys({ name: 'firstName' }) // { firstName: 'Bill' }
     * 
     * @returns The mutated array with with renamed keys
     */
    renameKeys(keysMap: Object): Object
    /**
     * @description Creates a shallow copy of an existing object, newObj !== argumentObj
     * @param obj 
     * 
     * @returns A shallow clone of the passed in object
     */
    shallowClone(obj: Object): Object
}

declare interface Function {
    /**
     * @description Will iterate through multiple functions and return an index of the highest performing function
     * @param fns The functions to iterate through
     * @param interations Amount of times to iterate through the functions
     * 
     * @returns The index of the quickest performing function over a certain amount of iterations
     */
    mostPerformant(fns: Function[], interations: number): number
    /**
     * @description Retrieves the time taken to run a function
     * @param args The arguments necessary to run the original function, if multiple use an array
     * 
     * @@returns The time taken to run the callback function.
     */
    timeTaken(...args: T | T[]): number
}

declare interface Date {
    /**
     * @description Will retrieve a date representing the time at a point from now
     * @param time An amount of time to get before now
     * @example "ms('5m') will get 5 minutes ago from Date.now()"
     * 
     * @returns The date prior by the specific amount of time from now
     */
    getTimeFromNow(time: number): Date
}