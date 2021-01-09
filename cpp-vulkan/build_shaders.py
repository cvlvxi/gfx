import os 
import subprocess

shaders_dir = "shaders"

def compile_shader(shader_file):
    base_fn = os.path.basename(shader_file)
    fn_parts = base_fn.split(".")
    if len(fn_parts) != 2:
        print("Skipping: {}".format(shader_file))
        return
    fn = fn_parts[0]
    ext = fn_parts[1]

    if ext == "vert":
        new_path = os.path.join(shaders_dir, "out", fn + ".vert.spv")
    elif ext == "frag":
        new_path = os.path.join(shaders_dir, "out", fn + ".frag.spv")
    else:
        print("Skipping: {}".format(shader_file))
        return
    path = os.path.join(shaders_dir, base_fn)
    cmd = [
        "glslc",
        path,
        '-o',
        new_path
    ]
    subprocess.call(cmd)

for i in os.listdir(shaders_dir):
    print("Compiling {}".format(i))
    compile_shader(i)