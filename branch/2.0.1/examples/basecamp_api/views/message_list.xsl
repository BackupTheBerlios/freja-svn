<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" indent="yes" encoding="UTF-8"/>

<!-- ====================================================================================  
  MESSAGE LIST (POSTS+COMMENTS)  
 ==================================================================================== -->

<xsl:template match="/posts">	
	<div id="messageList" class="messageList">
		<img src="images/note_add.png" alt="Post Message" title="Post a New Message" class='newMessageLink clickable' />
		<h3>Messages</h3>		
		<ul>
			<xsl:apply-templates />
		</ul>
	</div>
</xsl:template>

<!-- ==================================================================================== 
  POST  
 ==================================================================================== -->

<xsl:template match="post[not(@edit) or @edit='false']">	
	<li>
		<a href='#' id='post__{id}' class='editMessageLink'><xsl:value-of select="title"/></a>&#160;
		<xsl:if test="comments-count">
			(<xsl:value-of select="comments-count"/>)
		</xsl:if>
		<img src="images/note_delete.png" id='trash__{id}' alt="Delete Message" title="Delete this Message" class='trashMessageLink clickable' />&#160;
		<p class="meta">Posted on <xsl:value-of select="posted-on"/> in <span class="category"><xsl:value-of select="category/name"/></span>&#160;
		<xsl:if test="attachments-count>0">
			(<xsl:value-of select="attachments-count"/> attachements)
		</xsl:if>
		</p>	
	   <img src="images/comment_add.png" alt="Add Comment" id="postcomment2__{id}" title="Add a Comment" class="newCommentLink clickable" />  <a href='#' title='Add a Comment' id="postcomment__{id}" class="newCommentLink" >&#160;Post a comment</a>	
		<xsl:if test="not(comments/comment)">
			<p class="meta"><a href='#' id="comments__{id}" class='refreshCommentsLink'>Show Comments</a></p>.
		</xsl:if>
		<xsl:if test="comments/comment">
			<xsl:apply-templates />
		</xsl:if>	
	</li>
</xsl:template>

<!-- ====================================================================================  
  POST (EDIT MODE) 
 ==================================================================================== -->

<xsl:template match="post[@edit='true']">	
	<li>
		<form method="post" action="#" id="message__{id}" class="editMessageForm" >
			<label for="posttitle" class="preField">Title: </label>
			<input type="text" name="//post[id='{id}']/title" id="posttitle" value="{title}" /><br/>
			
			<xsl:if test="body">
				<label for="postbody" class="preField">Body: </label>
				<textarea name="//post[id='{id}']/body" id="postbody">
					<xsl:value-of select="body" />
				</textarea>
			</xsl:if>
			
			<xsl:if test="not(body)">
				This message is only partially loaded. <a href='#' class='getMessageBodyLink' id='getBody__{id}'>Get Full Message</a>
			</xsl:if>
			
			<p>Posted on: <xsl:value-of select="posted-on" /></p>
			<p>
				<input type="hidden" value="false" name="//post[id='{id}']/@synchronized" />
				<input type="button" value="cancel" class="cancelAction" />
				<input type="submit" value="ok" class="primaryAction" />
			</p>
		</form>
	</li>
</xsl:template>

<!-- ====================================================================================  
  COMMENTS 
 ==================================================================================== -->

<xsl:template match="comments">	
	<ul id="comments__{../id}" class="commentList">
		<xsl:apply-templates />
	</ul>
</xsl:template>

<xsl:template match="comment[not(@edit) or @edit='false']">	
	<li>
		<img src="images/comment_quote.png" alt="&quot;" align="left" style="margin: 0 10px 0 0" /><xsl:value-of select="body"/>&#160;
		<img src="images/comment_edit.png" id='editcomment__{id}' alt="Edit Comment" title="Edit Comment" class='editCommentLink clickable' />&#160;		
		<img src="images/comment_delete.png" id='trashcomment__{id}' alt="Delete Comment" title="Delete this Comment" class='trashCommentLink clickable' />&#160;
		<p class="meta">Posted on <xsl:value-of select="posted-on"/> </p>		
	</li>
</xsl:template>

<!-- ====================================================================================  
  COMMENT (EDIT MODE) 
 ==================================================================================== -->

<xsl:template match="comment[@edit='true']">	
	<li>
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
	</li>
</xsl:template>



<xsl:template match="text()" />
</xsl:stylesheet>