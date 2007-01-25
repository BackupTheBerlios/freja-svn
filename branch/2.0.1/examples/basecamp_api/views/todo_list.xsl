<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/todo-lists">	
	<h3>To-do lists</h3>
	<ul>
		<xsl:apply-templates />
	</ul>
</xsl:template>

<xsl:template match="todo-list">	
	<li>
		<a href='#' id='todolist_{id}' class='editToDoListLink'><xsl:value-of select="name"/></a>
		<xsl:apply-templates />
	</li>
</xsl:template>

<xsl:template match="text()" />
</xsl:stylesheet>