diagram_str = ""
started = False
start_delimiter = r"%% Start Diagram"
end_delimiter = r"%% End Diagram"
with open("mermaid.md", "r") as f:
    for line in f:
        if start_delimiter in line:
            started = True
            continue
        if end_delimiter in line:
            started = False
            break
        if started:
            diagram_str += line

with open("mermaid", "w") as f:
    f.write(diagram_str)
