-- Vertex

#extension GL_ARB_explicit_attrib_location : enable

layout(location = 0) in vec3 vertex;

out vec2 texCoord;

void main()
{
	// ToDo
	//texCoord = vertex.xy;
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
			vec3 col1 = texture2D(frontFaces, texCoord).rgb;
			fragColor = vec4(col1, 1.0f);
			break;
		}

		case 1: //render back faces
		{

		vec3 col2 = texture2D(backFaces, texCoord).rgb;
		fragColor = vec4(col2, 1.0f);
		break;


			break;
		}

		case 2: //render volume (MIP)
		{
			vec3 startPos = texture2D(frontFaces, texCoord).rgb;
			vec3 endPos = texture2D(backFaces, texCoord).rgb;
			vec3 ray = endPos - startPos;
			float rayLength = length(ray);
			vec3 step = 0.1f * normalize(ray);

			float maxIntensity = 0;
			vec3 curSamplePos = startPos;
			for(int i = 0; i < 100; i++){
				float cur = texture3D(volume, endPos-curSamplePos).x;
				if(cur > maxIntensity){
				maxIntensity = cur;
				}
				curSamplePos += step;
			}

			//fragColor = vec4(startPos, 1.0f);
			//fragColor = vec4(endPos, 1.0f);
			fragColor = vec4(maxIntensity, 0.0f, 0.0f, 1.0f);

			break;
		}
		case 3: //render volume (Alpha-Compositing)
		{
			break;
		}
	}
}
