<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="projects">	
	<label for="currentProjectSelector" class="preField" >Current Project: </label>
	<select id="currentProjectSelector" class="projectSelector">		
		<xsl:apply-templates />
	</select>
</xsl:template>

<xsl:template match="project">	
	<option value="{id}">
		<xsl:value-of select="name"/>
	</option>
</xsl:template>

<xsl:template match="text()" />
</xsl:stylesheet>