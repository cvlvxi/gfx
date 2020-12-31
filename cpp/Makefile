BUILD_DIR=build
DEBUGGER=lldb

all: link_build

cmakebuild: makebuilddir
	(cd $(BUILD_DIR); cmake ..; make)

link_build: cmakebuild
	((rm compile_commands.json 2> /dev/null || true) && ln -s $(BUILD_DIR)/compile_commands.json compile_commands.json)

makebuilddir:
	mkdir -p $(BUILD_DIR)

clean:
	rm -rf $(BUILD_DIR)

test: all
	(cd $(BUILD_DIR); make test)

