<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="projects">	
	<xsl:apply-templates />
</xsl:template>

<xsl:template match="project">	
	<form method="post" action="#" id="project__{id}">
		<label for="projectname" class="preField">Project Name: </label>
		<input type="text" name="//project[id={id}]/name" value="{name}" /><br/>
		
		<label for="projectstatus" class="preField">Project Status: </label>
		<select name="//project[id={id}]/status">
			<option value='active'>
				<xsl:if test="status='active'">
					<xsl:attribute name='selected'>selected</xsl:attribute>
				</xsl:if>
				active
			</option>
			<option value='inactive'>
				<xsl:if test="status='inactive'">
					<xsl:attribute name='selected'>selected</xsl:attribute>
				</xsl:if>
				inactive
			</option>
		</select><br/>
		<p>
			<input type="button" value="cancel" />
			<input type="submit" value="ok" />
		</p>
	</form>
</xsl:template>

<xsl:template match="text()" />
</xsl:stylesheet>