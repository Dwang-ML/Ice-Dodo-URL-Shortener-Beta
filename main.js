async function main() {
    let pyodide = await loadPyodide();
    console.log("Loading pyodide...")
    await pyodide.loadPackage("micropip");
    const pythonCode = `
import copy
letters = list('BCDGECFA')
prefix = 'https://onionfist.com/icedodo/?mapCodeVersion=v8&mapUrl='
map = {}
def link2map(link):
    global map
    current = []
    lead = ''
    info = ''
    for char in link:
        if char in letters:
            map[lead].append(current)
            current.append(info)
            info = ''
            current = []
            lead = char
        elif char == '$':
            current.append(info)
            info = ''
        else:
            info += char
    map[lead].append(current)
    current.append(info)
    del map['']
def delete_empty():
    global map
    temp = []
    for key in map.keys():
        if not map[key]:
            temp.append(key)
    for del_ in temp:
        del map[del_]
def shorten_link():
    global map
    for key in map.keys():
        for item_n in range(len(map[key])):
            for element_n in range(len(map[key][item_n])):
                try:
                    map[key][item_n][element_n] = str(round(float(map[key][item_n][element_n])))
                except:
                    pass
                if map[key][item_n][element_n] == 'none':
                    map[key][item_n][element_n] = 'n'
    new_map = {}
    for key, value in map.items():
        new_map[key] = list(set(tuple(sublist) for sublist in value))
    map = new_map
def map2link():
    global map, prefix, original_len, link
    inf = {'Block': None, 'Cone': None, 'Sphere': None, 'Cylinder': None, 'Plane': None, 'Monkey': None, 'Finish': None}
    if 'B' in map.keys():
        inf['Block'] = len(map['B'])
    else:
        inf['Block'] = 0
    if 'C' in map.keys():
        inf['Cone'] = len(map['C'])
    else:
        inf['Cone'] = 0
    if 'F' in map.keys():
        inf['Sphere'] = len(map['F'])
    else:
        inf['Sphere'] = 0
    if 'E' in map.keys():
        inf['Cylinder'] = len(map['E'])
    else:
        inf['Cylinder'] = 0
    if 'A' in map.keys():
        inf['Plane'] = len(map['A'])
    else:
        inf['Plane'] = 0
    if 'G' in map.keys():
        inf['Monkey'] = len(map['G'])
    else:
        inf['Monkey'] = 0
    if 'D' in map.keys():
        inf['Finish'] = len(map['D'])
    else:
        inf['Finish'] = 0
    link = ''
    for key in map.keys():
        for item in map[key]:
            temp = key + '$'.join(item)
            link += temp
    URL = prefix + link
    new_len = len(URL)
    return f'Original Length: {original_len}\\nNew Length: {new_len}\\nPercentage Decreased: {round((original_len-new_len)/original_len*100, 2)}%\\nCharacter Decreased: {original_len-new_len}\\n{inf["Block"]} block(s)\\n{inf["Cone"]} cone(s)\\n{inf["Sphere"]} sphere(s)\\n{inf["Cylinder"]} cylinder(s)\\n{inf["Plane"]} plane(s)\\n{inf["Monkey"]} monkey(s)\\n{inf["Finish"]} finish(es)\\nTotal elements/items: {sum(inf.values())}\\nGood luck! Hope your map gets approved!\\n\\nNew URL: ', URL
def shorten(link):
    global original_len, map
    map = {'': [], 'B': [], 'F': [], 'C': [], 'G': [], 'E': [], 'D': [], 'A': []}
    original_len = len(link)
    link = link[56:]
    link2map(link)
    delete_empty()
    old_map = copy.deepcopy(map)
    shorten_link()
    return map2link()
def main(value):
    if len(str(value)) != 0:
        result = shorten(value)
        return result
    else:
        return "Input value is empty.", ""
        `;
    await pyodide.runPythonAsync(pythonCode);
    console.log('Pyodide loaded.')
    document.getElementById('inputForm').addEventListener('submit', async function(event) {
        console.log("Form submitted.")
        event.preventDefault();
        let value = document.getElementById('inputValue').value;
        console.log('Input value:', value);  // Debug log
        let result = await pyodide.runPythonAsync(`main("${value}")`);
        let [textResult, urlResult] = result.toJs();
        console.log('Text Result:', textResult);  // Debug log
        console.log('URL Result:', urlResult);  // Debug log
        document.getElementById('result').innerText = textResult;
        document.getElementById('copyArea').value = urlResult; // Show result in input box
        document.getElementById('copyArea').style.display = 'block'; // Show the input box
        document.getElementById('copyButton').style.display = 'inline-block'; // Show the button
    });
}

function copyToClipboard() {
    let copyText = document.getElementById('copyArea').value;
    navigator.clipboard.writeText(copyText).then(function() {
        console.log("Copied link.")
        alert('URL copied to clipboard!');
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}

main();
