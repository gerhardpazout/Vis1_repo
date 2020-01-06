-- Vertex

#extension GL_ARB_explicit_attrib_location : enable

uniform mat4 mvMatrix;
uniform mat4 projMatrix;

layout(location = 0) in vec3 vertex;
layout(location = 1) in vec3 texCoord;

out vec3 texCoordVar;


void main()
{
	// ToDo
	texCoordVar = texCoord;

	vec4 pos = projMatrix * mvMatrix * vec4(vertex, 1.0f);
	gl_Position = pos;
}

-- Fragment

in vec3 texCoordVar;

//layout(location = 0)out vec4 fragColor;
out vec4 fragColor;

void main()
{
   //fragColor = vec4(texCoordVar, 1.0f);
	 fragColor = vec4(0.0f,1.0f,0.0f,1.0f);
}
