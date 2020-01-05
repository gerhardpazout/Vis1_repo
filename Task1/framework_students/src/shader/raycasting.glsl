-- Vertex

#extension GL_ARB_explicit_attrib_location : enable

layout(location = 0) in vec3 vertex;

out vec2 texCoord;

void main()
{
	// ToDo
	texCoord = 0.5 * (vertex.xy + vec2(1.0f, 1.0f));
	gl_Position = vec4(vertex, 1.0f);
}

-- Fragment

uniform sampler2D frontFaces;
uniform sampler2D backFaces;
uniform sampler3D volume;

uniform int renderingMode;

in vec2 texCoord;
out vec4 fragColor;

void main()
{
	// ToDo


	switch(renderingMode)
	{
		case 0: //render front faces
		{
			vec3 col = texture2D(frontFaces, texCoord).rgb;
			fragColor = vec4(col,1.0f);
			break;
		}

		case 1: //render back faces
		{



			break;
		}

		case 2: //render volume (MIP)
		{



			break;
		}
		case 3: //render volume (Alpha-Compositing)
		{
			break;
		}
	}
}
