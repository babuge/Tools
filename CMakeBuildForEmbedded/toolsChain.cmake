# to required Linux Windows  Generic
SET(CMAKE_SYSTEM_NAME Linux)
SET(CMAKE_CROSSCOMPILING TRUE)

# specify the cross compiler
SET(CMAKE_C_COMPILER /opt/arm-x86_64-arm-linux-gnueabihf/bin/arm-none-linux-gnueabihf-gcc)
SET(CMAKE_CXX_COMPILER /opt/arm-x86_64-arm-linux-gnueabihf/bin/arm-none-linux-gnueabihf-g++)

# where is the target environment 
SET(CMAKE_FIND_ROOT_PATH  /opt/arm-x86_64-arm-linux-gnueabihf)

# search for programs in the build host directories (not necessary)
SET(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
SET(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
SET(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
SET(CMAKE_FIND_ROOT_PATH_MODE_PACKAGE ONLY)

# configure Boost and Qt
#SET(QT_QMAKE_EXECUTABLE /opt/qt-embedded/qmake)


# configure Boost
#SET(BOOST_ROOT /home/mysqlCompile/boost_1_59_0/__install)
#SET(BOOST_INCLUDE_DIR /home/mysqlCompile/boost_1_59_0/__install/include)
#SET(BOOST_LIBRARY_DIR /home/mysqlCompile/boost_1_59_0/__install/lib)


