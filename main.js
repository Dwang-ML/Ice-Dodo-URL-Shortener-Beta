async function main() {
    console.log("Loading pyodide...");
    let pyodide = await loadPyodide();

    console.log("Pyodide loaded. Loading micropip...");
    await pyodide.loadPackage("micropip");
    console.log("micropip loaded.");

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
    temp = [key for key in map.keys() if not map[key]]
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
    new_map = {key: list(set(tuple(sublist) for sublist in value)) for key, value in map.items()}
    map = new_map

def map2link():
    global map, prefix, original_len, link
    inf = {'Block': 0, 'Cone': 0, 'Sphere': 0, 'Cylinder': 0, 'Plane': 0, 'Monkey': 0, 'Finish': 0}
    for key in map.keys():
        if key == 'B':
            inf['Block'] = len(map[key])
        elif key == 'C':
            inf['Cone'] = len(map[key])
        elif key == 'F':
            inf['Sphere'] = len(map[key])
        elif key == 'E':
            inf['Cylinder'] = len(map[key])
        elif key == 'A':
            inf['Plane'] = len(map[key])
        elif key == 'G':
            inf['Monkey'] = len(map[key])
        elif key == 'D':
            inf['Finish'] = len(map[key])
    
    link = ''.join([key + '$'.join(item) for key in map.keys() for item in map[key]])
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

    console.log('Python code loaded.');

    document.getElementById('inputForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        let value = document.getElementById('inputValue').value;
        console.log('Input value:', value);
        
        let result = await pyodide.runPythonAsync(`main("${value}")`);
        let [textResult, urlResult] = result.toJs();
        
        console.log('Text Result:', textResult);
        console.log('URL Result:', urlResult);
        
        document.getElementById('result').innerText = textResult;
        document.getElementById('copyArea').value = urlResult;
        document.getElementById('copyArea').style.display = 'block';
        document.getElementById('copyButton').style.display = 'inline-block';
    });
}

function copyToClipboard() {
    let copyText = document.getElementById('copyArea').value;
    navigator.clipboard.writeText(copyText).then(function() {
        console.log("Copied link.");
        alert('URL copied to clipboard!');
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}

main();
