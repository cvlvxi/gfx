IMG_DIR="../imgs"

build:
	(python get_diagram.py && mmdc -t forest -i mermaid -o out.png -s 5 -b transparent  && open out.png)

link: build
	(cp out.png $(IMG_DIR)/diagram.png)
