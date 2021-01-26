#pragma once

#include <algorithm>
#include <fstream>
#include <iostream>
#include <sstream>
#include <stdio.h>
#include <string>
#include <vector>
using namespace std;

#include <stdlib.h>
#include <string>

#include <GL/glew.h>

GLuint LoadShaders(const char *vertex_file_path,
                   const char *fragment_file_path);
