<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:param name="commentId" ></xsl:param>
<xsl:param name="title" >Edit Comment</xsl:param>
<xsl:template match="/">
	<xsl:apply-templates select="//comment[id=$commentId]" />
</xsl:template>

<xsl:template match="comment">	
	<div id="editComment">
		<h3><xsl:value-of select="$title" /></h3>

		<form method="post" action="#" id="comment__{id}" class="editCommentForm" >
			
			<xsl:if test="body">
				<label for="commentbody" class="preField">Body: </label>
				<textarea name="//comment[id='{id}']/body" id="commentbody">
					<xsl:value-of select="body" />
				</textarea>
			</xsl:if>
			
			<xsl:if test="posted-on">
				<p class="meta">Posted on: <xsl:value-of select="posted-on" /></p>
			</xsl:if>
			<p>
				<input type="hidden" value="false" name="//comment[id='{id}']/@synchronized" />
				<input type="button" value="cancel" class="cancelAction" />
				<input type="submit" value="ok" class="primaryAction" />
			</p>
		</form>
	</div>
</xsl:template>

<xsl:template match="text()" />
</xsl:stylesheet>